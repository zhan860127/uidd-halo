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

  console.log('getKey req received');
  const keyList = await getRepository(ParentAudio)
  .createQueryBuilder('keyword')
  .getMany();
  console.log(typeof keyList);
  console.log(keyList);
  console.log(JSON.stringify(keyList));
  res.send(JSON.stringify(keyList));
})

export default router;