import path from 'path';
import { Router } from 'express';
import multer from 'multer';
import { promisify } from 'util';
import { writeFile, unlink, mkdir } from 'fs';
import { getRepository, createQueryBuilder } from 'typeorm';
import { Parent, Child, ParentAudio } from '../models/entity/entities';
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
  .select(['keyword.id', 'keyword.keyword', 'keyword.path'])
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
  const parent = await Login.getParent(req);
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

router.get('/getAudio/:id', async (req, res) => {
  console.log("received audio file request");
  const id = req.params.id;
  console.log(`req id: ${id}`);
  const audio = await createQueryBuilder(ParentAudio, 'keyword')
    .where('keyword.id = :id',  { id })
    .getOne();
  if (!audio) return res.sendStatus(404);
  console.log(audio.path!);
  res.sendFile(audio.path!, { root: '.'});
})

router.get('/deleteKey', async (req, res) => {
  const id = req.query.id;
  const del_path = await getRepository(ParentAudio)
    .createQueryBuilder()
    .select('ParentAudio.path')
    .where("id = :id", { id: id})
    .getOne();
  if (del_path === undefined) return false;
  await promisify(unlink)(del_path!.path!);
  await getRepository(ParentAudio)
    .createQueryBuilder()
    .delete()
    .where('id = :id', { id })
    .execute();
  res.send(true); 
})

export default router;