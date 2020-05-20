import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs';
import { getRepository, createQueryBuilder } from 'typeorm';
import { Parent, Child, ParentAudio } from '../models/entity/entities';
import { getParent } from './Login';
import { randomName } from './misc';
import * as Login from './Login';

const uploadPath = process.env.UPLOAD_PATH;
const upload = multer();
const router = Router();

if (!uploadPath)
  throw new Error('Upload path not set. Please edit the .env file');

router.get('/getKey', async (req, res) => {
  const keyList = await getRepository(ParentAudio)
  .createQueryBuilder('keyword')
  .select(['keyword.id', 'keyword.keyword'])
  .getMany();
  res.send(JSON.stringify(keyList));  
})

router.get('/changeKey', async (req, res) => {
  let newKey = req.query.key;
  const id = req.query.id;
  const key = await getRepository(ParentAudio)
  .createQueryBuilder('key')
  .where('key.keyword = :keyword', { keyword: newKey })
  .getOne(); 
  if (key == undefined) {
    await getRepository(ParentAudio)
      .createQueryBuilder()
      .update()
      .set({ keyword: (newKey as string)})
      .where("id = :id", { id: id})
      .execute();
    res.send(true);
  }
  else {
    res.send(false);
  }
})

router.post('/addKeyAudio', upload.single('audio'), async (req, res) => {
  const date = new Date();
  const child = await getRepository(Child).findOne(req.body.childId);
  const parent = await getParent(req);
  if (!child || !parent) return res.sendStatus(404);
  // save file
  const buffer = req.file.buffer;
  await promisify(mkdir)(uploadPath, { recursive: true });
  const oggFilename = `${randomName()}.ogg`;
  const oggPath = path.join(uploadPath!, oggFilename);
  await promisify(writeFile)(oggPath, buffer);
  // compute id
  let id = await getRepository(ParentAudio)
  .createQueryBuilder('keyword')
  .select('MAX(keyword.id)', 'max')
  .getRawOne();
  id = id.max + 1;
  // add to database
  await getRepository(ParentAudio)
  .createQueryBuilder()
  .insert()
  .values({
    id: id, 
    createdAt: date,
    keyword: req.body.keyword,
    path: oggPath,
    parent: parent,
    child: child
  })
  .execute();
  res.send(true);
})

router.get('/deleteKey', async (req, res) => {
  const id = req.query.id;
  //  TODO: read the path and delete the file
  await getRepository(ParentAudio)
    .createQueryBuilder()
    .delete()
    .where('id = :id', { id })
    .execute();
  res.send(true);
})

export default router;