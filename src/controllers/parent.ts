import { Router } from 'express';
import { Connection } from "typeorm";
import { Parent } from '../models/entity/Parent';
import { Child } from '../models/entity/Child';




module.exports = (connection: Connection) => {
    const router = Router();

    router.get('/children', async (req, res) => {
        const parent = await connection
            .getRepository(Parent)
            .findOne({
                where: {
                    id: (req.user as Parent).id,
                },
                relations: ['children'],
            })
        if (!parent) {
            return res.sendStatus(500);
        }
        res.render('child_select', {
            name: (req.user as Parent).username,
            children: parent.children,
        });
    })

    router.get('/', async (req, res) => {
        const child = await connection.getRepository(Child)
            .createQueryBuilder('child')
            .innerJoinAndSelect('child.parents', 'parent')
            .where('parent.id = :parentId', { parentId: (req.user as Parent).id })
            .andWhere('child.id = :childId', { childId: req.query.c })
            .getOne();
        if (!child) return res.sendStatus(404);
        res.render('function_select', { child })
    });


    return router;
};