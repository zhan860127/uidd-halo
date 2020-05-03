import { Request } from 'express';
import { Connection } from 'typeorm';
import { Parent } from './models/entity/Parent';

export function logInParent(req: Request, parentId: number) {
  req.session.parentId = parentId;
}

export function logOutParent(req: Request) {
  req.session.parentId = undefined;
}

export function parentLoggedIn(req: Request): boolean {
  return !!req.session.parentId;
}

export function getParentId(req: Request): number | null {
  return req.session.parentId || null;
}

export async function getParent(req: Request, connection: Connection): Promise<Parent> {
  return connection
    .getRepository(Parent)
    .findOne({
      where: {
        id: getParentId(req),
      },
      relations: ['children'],
    });
}

export function getChild(req: Request, connection: Connection) {

}
