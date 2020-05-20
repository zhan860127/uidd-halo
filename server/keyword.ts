import { Router } from 'express';
import { getRepository, createQueryBuilder } from 'typeorm';
import { Parent, Child, ParentAudio } from '../models/entity/entities';
import { randomFilename } from './misc';
import * as Login from './Login';

const uploadPath = process.env.UPLOAD_PATH;
const router = Router();

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

router.get('/addKey', async (req, res) => {
  //  for TESTING only, rewrite later
  //  check duplicate
  const keyword = req.query.key as string;
  const duplicate = await getRepository(ParentAudio)
    .createQueryBuilder('key')
    .where('key.keyword = :keyword', { keyword })
    .getOne();
  if (duplicate == undefined) {
    //  computate id
    let id = await getRepository(ParentAudio)
      .createQueryBuilder('keyword')
      .select('MAX(keyword.id)', 'max')
      .getRawOne();
    id = id.max + 1;
    // no real ogg is created instead as just testing
    const path = `${uploadPath}${randomFilename()}.ogg`; 
    const parent = await Login.getParent(req);
    const child = await Login.getChild(req);
    //  add to database
    await getRepository(ParentAudio)
    .createQueryBuilder()
    .insert()
    .values({
      id: id, 
      createdAt: Date.now(),
      keyword: keyword,
      path: path,
      parent: parent,
      child: child
    })
    .execute();
    res.send(true);
  } else res.send(false);
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

router.get('/test', async (req, res) => {
  /*  const parent = await Login.getParent(req);
  const child = await Login.getChild(req);
  await getRepository(ParentAudio)
    .createQueryBuilder()
    .insert()
    .values({
      id: 0, 
      createdAt: new Date(123456),
      updatedAt: new Date(654321),
      keyword: 'Nya',
      path: './somewhere/nya.ogg',
      parent: parent,
      child: child
    })
    .execute();   */

  console.log('test start');

  

  /*  console.log(typeof max);
  console.log(max);
  console.log(JSON.stringify(max));
  res.send(JSON.stringify(max));  */
})

export default router;