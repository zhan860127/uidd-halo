import { promisify } from 'util';
import { unlink } from 'fs';
import { Router, RequestHandler, json } from 'express';
import {
  getConnection,
  getRepository,
  createQueryBuilder,
  getManager,
} from 'typeorm';
import { Parent, Child, ChildAudio } from '../models/entity/entities';

import * as Login from './Login';
import { newChildToken } from './misc';

const router = Router();

const ensureParentLoggedIn: RequestHandler = (req, res, next) => {
  if (!Login.parentLoggedIn(req)) return res.sendStatus(401);
  next();
};

router.use(ensureParentLoggedIn);

router.get('/all', async (req, res) => {
  res.send((await Login.getParent(req))!.username);
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
  const child = await getRepository(Child)
    .createQueryBuilder('child')
    .innerJoinAndSelect('child.parents', 'parent')
    .where('parent.id = :parentId', { parentId: Login.getParentId(req) })
    .andWhere('child.id = :childId', { childId })
    .getOne();
  if (!child) return res.sendStatus(404);
  res.json({
    name: child.name!,
    token: child.token!,
  });
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
  const childId = req.query.c;
  const parentId = await Login.getParentId(req);
  if (!fromDate || !childId || !parentId) return res.status(401).json();
  const child = await getRepository(Child)
    .createQueryBuilder('child')
    .innerJoinAndSelect('child.parents', 'parent')
    .where('parent.id = :parentId', { parentId })
    .andWhere('child.id = :childId', { childId })
    .getOne();
  if (!child) return res.sendStatus(404);

  const maxResults = 50;
  const audios = await createQueryBuilder(ChildAudio)
    .where('createdAt <= datetime(:fromDate)', {
      fromDate,
    })
    .orderBy('createdAt')
    .limit(maxResults)
    .getMany();
  res.json(
    audios.map((x) => ({
      id: x.id,
      date: x.createdAt,
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

router.post('/add_child', async (req, res) => {
  const connection = await getConnection();
  if (!req.body.name) {
    res.status(400);
    return res.send('no name sent');
  }
  const parent = await connection.getRepository(Parent).findOne({
    where: {
      id: Login.getParentId(req),
    },
    relations: ['children'],
  });
  if (!parent) {
    return res.sendStatus(500);
  }
  const child = new Child();
  child.name = req.body.name;
  child.token = newChildToken();
  await connection.manager.save(child);
  parent.children!.push(child);
  await connection.manager.save(parent);
  res.redirect(302, '/parent/children');
});

export default router;
