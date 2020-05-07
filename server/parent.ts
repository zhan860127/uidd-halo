import { Router, RequestHandler } from 'express';
import { getConnection, getRepository } from 'typeorm';
import { Parent, Child } from '../models/entity/entities';

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
