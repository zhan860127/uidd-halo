import { Router } from 'express';
import { Connection } from 'typeorm';
import { Parent } from '../models/entity/Parent';
import { Child } from '../models/entity/Child';
import * as Login from '../Login';
import { newChildToken } from '../misc';


export default function (connection: Connection) {
  const router = Router();

  router.get('/children', async (req, res) => {
    const parent = await connection
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
    res.render('child_select', {
      name: (await Login.getParent(req, connection)).username,
      children: parent.children,
    });
  });

  router.get('/', async (req, res) => {
    const child = await connection.getRepository(Child)
      .createQueryBuilder('child')
      .innerJoinAndSelect('child.parents', 'parent')
      .where('parent.id = :parentId', { parentId: Login.getParentId(req) })
      .andWhere('child.id = :childId', { childId: req.query.c })
      .getOne();
    if (!child) return res.sendStatus(404);
    res.render('function_select', { child });
  });

  router.post('/add_child',
    async (req, res) => {
      if (!req.body.name) {
        res.status(400);
        return res.send('no name sent');
      }
      const parent = await connection
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
      const child = new Child();
      child.name = req.body.name;
      child.token = newChildToken();
      await connection.manager.save(child);
      parent.children.push(child);
      await connection.manager.save(parent);
      res.redirect(302, '/parent');
    });


  return router;
}
