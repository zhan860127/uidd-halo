import { Router, RequestHandler } from 'express';
import { getRepository } from 'typeorm';
import { Child } from '../models/entity/entities';
import { childLoggedIn, getChildId, logInChild } from './Login';

const router = Router();
const ensureChildLoggedIn: RequestHandler = (req, res, next) => {
  if (!childLoggedIn(req)) return res.sendStatus(401);
  next();
};

router.use(ensureChildLoggedIn);

router.get('/me', async (req, res) => {
  const child = await getRepository(Child).findOne(await getChildId(req)!);
  if (!child) return res.sendStatus(404);
  res.json({
    name: child.name!,
  });
});

export default router;
