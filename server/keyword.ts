import path from 'path';
import { Router } from 'express';
import { writeFile, unlink } from 'fs';
import { randomFilename } from './misc';
import {
  getConnection,
  getRepository,
  createQueryBuilder,
  getManager,
} from 'typeorm';
import multer from 'multer';
import { ParentAudio } from '~/models/entity/entities';

const uploadPath = process.env.UPLOAD_PATH;
const upload = multer();
const router = Router();

router.get('/getKey', async (req, res) => {
  console.log('getKey req received');
  const keyList = getRepository(ParentAudio)
  .createQueryBuilder('keyword')
  .getMany();
  console.log(typeof keyList);
})

export default router;