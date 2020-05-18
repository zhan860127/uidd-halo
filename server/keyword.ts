import { Router } from 'express';
import { getRepository } from 'typeorm';
import { Parent, Child, ParentAudio } from '../models/entity/entities';
import * as Login from './Login';

const router = Router();

router.get('/getKey', async (req, res) => {
  const keyList = await getRepository(ParentAudio)
  .createQueryBuilder('keyword')
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
  const newKey = 'ass';
  const result = await getRepository(ParentAudio)
  .createQueryBuilder('key')
  .where('key.keyword = :keyword', { keyword: newKey })
  .getOne();
  console.log(typeof result);
  console.log(result);
  console.log(JSON.stringify(result));
  res.send(JSON.stringify(result));
})

export default router;