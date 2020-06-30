import { promisify } from 'util';
import { unlink, writeFile } from 'fs';
import path from 'path';
import { Router, RequestHandler, json, Request } from 'express';
import {
  getConnection,
  getRepository,
  createQueryBuilder,
  getManager,
} from 'typeorm';
import QRCode from 'qrcode';
import multer from 'multer';
import { config } from 'dotenv';
import { Parent, Child, ChildAudio, Image } from '../models/entity/entities';

import * as Login from './Login';
import { newChildToken, randomFilename } from './misc';
config();

const upload = multer();
const uploadPath = process.env.UPLOAD_PATH;
if (!uploadPath)
  throw new Error('Upload path not set. Please edit the .env file');

const router = Router();

const ensureParentLoggedIn: RequestHandler = (req, res, next) => {
  if (!Login.parentLoggedIn(req)) return res.sendStatus(401);
  next();
};

async function getChild(
  req: Request,
  childId: number | string
): Promise<Child | undefined> {
  const parentId = await Login.getParentId(req);
  return getRepository(Child)
    .createQueryBuilder('child')
    .innerJoinAndSelect('child.parents', 'parent')
    .leftJoinAndSelect('child.image', 'image')
    .where('parent.id = :parentId', { parentId })
    .andWhere('child.id = :childId', { childId })
    .getOne();
}

router.use(ensureParentLoggedIn);

router.get('/all', async (req, res) => {
  res.send((await Login.getParent(req))!.username);
});

router.get('/connect/:id', async (req, res) => {
  const childId = req.params.id as string;
  if (!childId) return res.status(404).json();
  const child = await getChild(req, childId);
  if (!child) return res.status(404).json();
  const url = `${req.protocol}://${req.get(
    'host'
  )}/api/connect/${child.token!}`;
  const qrSVG = await QRCode.toString(url, {
    type: 'svg',
    color: { light: '#0000' },
  });
  res.json({
    token: child.token!,
    url,
    qrSVG,
  });
});

router.get('/children', async (req, res) => {
  const parent = await getConnection()
    .getRepository(Parent)
    .findOne({
      where: {
        id: Login.getParentId(req),
      },
      relations: ['children'],
    });
  if (!parent) {
    return res.sendStatus(500);
  }
  res.json(parent.children!.map((c) => ({ name: c.name!, id: c.id! })));
});

router.get('/child', async (req, res) => {
  // GET /child?id=123
  if (!(typeof req.query.id === 'string')) return res.sendStatus(400);
  const childId = parseInt(req.query.id);
  if (isNaN(childId)) return res.sendStatus(400);
  const child = await getChild(req, childId);
  if (!child) return res.sendStatus(404);
  res.json({
    name: child.name!,
    token: child.token!,
  });
});
router.get('/childpic', async (req, res) => {
  // GET /child?id=123
  if (!(typeof req.query.id === 'string')) return res.sendStatus(400);
  const childId = parseInt(req.query.id);
  if (isNaN(childId)) return res.sendStatus(400);
  const child = await getChild(req, childId);
  if (!child) return res.sendStatus(404);
  const img = child.image
    ? child.image.path!
    : 'assets/img/child_placeholder.png';
  res.sendFile(img, { root: '.' });
});

router.post('/child_audio/edit', json(), async (req, res) => {
  const { id, transcript } = req.body;
  if (!id || !transcript || typeof transcript !== 'string')
    return res.status(400).json();
  const parentId = await Login.getParentId(req);
  const audio = await createQueryBuilder(ChildAudio, 'audio')
    .innerJoin('audio.child', 'child')
    .innerJoin('child.parents', 'parent')
    .where('parent.id = :parentId', { parentId })
    .where('audio.id = :id', { id })
    .getOne();
  if (!audio) return res.sendStatus(404);
  audio.transcript = transcript;
  getManager().save(audio);
  res.status(200).json({ message: 'success' });
});

router.post('/child_audio/delete/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json();
  const parentId = await Login.getParentId(req);
  const audio = await createQueryBuilder(ChildAudio, 'audio')
    .innerJoin('audio.child', 'child')
    .innerJoin('child.parents', 'parent')
    .where('parent.id = :parentId', { parentId })
    .where('audio.id = :id', { id })
    .getOne();
  if (!audio) return res.sendStatus(404);
  await getManager().delete(ChildAudio, audio.id!);
  await promisify(unlink)(audio.path!);
  res.status(200).json({ message: 'success' });
});

router.get('/child_audio', async (req, res) => {
  const fromDate = req.query.from || new Date().toISOString(); // datetime string with timezone
  const childId = req.query.c as string;
  if (!fromDate || !childId) return res.status(401).json();
  const child = await getChild(req, childId);
  if (!child) return res.sendStatus(404);

  const maxResults = 50;
  const audios = await createQueryBuilder(ChildAudio, 'audio')
    .where('childId = :childId', { childId })
    .andWhere('recordedAt <= datetime(:fromDate)', {
      fromDate,
    })
    .orderBy('recordedAt', 'DESC')
    .limit(maxResults)
    .getMany();
  res.json(
    audios.map((x) => ({
      id: x.id,
      date: x.recordedAt,
      transcript: x.transcript,
    }))
  );
});

router.get('/audiofile/:id', async (req, res) => {
  const parentId = Login.getParentId(req);
  const audioId = req.params.id;
  const audio = await createQueryBuilder(ChildAudio, 'audio')
    .innerJoin('audio.child', 'child')
    .innerJoin('child.parents', 'parent')
    .where('audio.id = :audioId', { audioId })
    .andWhere('parent.id = :parentId', { parentId })
    .getOne();
  if (!audio) return res.sendStatus(404);
  res.sendFile(audio.path!, { root: '.' });
});

function imgValid(file: Express.Multer.File) {
  return (
    file &&
    ['image/jpeg', 'image/png'].some((m) => m === file.mimetype) &&
    file.size < 5000000
  );
}

router.post('/add_child', upload.single('img'), async (req, res) => {
  if (!req.body.name || !req.file || !imgValid(req.file)) {
    res.sendStatus(400);
    return;
  }
  const connection = await getConnection();
  const parent = await connection.getRepository(Parent).findOne({
    where: {
      id: Login.getParentId(req),
    },
    relations: ['children'],
  });
  if (!parent) {
    return res.sendStatus(500);
  }
  const ext = req.file.mimetype.endsWith('png') ? 'png' : 'jpg';
  const filename = `${randomFilename()}.${ext}`;
  const imgPath = path.join(uploadPath, filename);
  await promisify(writeFile)(imgPath, req.file.buffer);
  const child = new Child();
  const image = new Image();
  image.path = imgPath;
  await connection.manager.save(image);
  child.name = req.body.name;
  child.image = image;
  child.token = newChildToken();
  await connection.manager.save(child);
  parent.children!.push(child);
  await connection.manager.save(parent);
  res.json({
    url: `/parent/logs?c=${child.id!}`,
  });
});

export default router;
