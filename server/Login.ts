import { Request } from 'express';
import { getRepository } from 'typeorm';
import { Parent, Child } from '../models/entity/entities';

const PARENT_ID = 'PARENT_ID';
const CHILD_ID = 'CHILD_ID';

export function logInParent(req: Request, parentId: number) {
  req.session![PARENT_ID] = parentId;
}

export function logOutParent(req: Request) {
  req.session![PARENT_ID] = undefined;
}

export function parentLoggedIn(req: Request): boolean {
  return !!req.session![PARENT_ID];
}

export function getParentId(req: Request): number | null {
  return req.session![PARENT_ID] || null;
}

export async function getParent(req: Request): Promise<Parent | undefined> {
  return await getRepository(Parent).findOne({
    where: {
      id: getParentId(req),
    },
    relations: ['children'],
  });
}

export function logInChild(req: Request, childId: number) {
  req.session![CHILD_ID] = childId;
}

export function logOutChild(req: Request) {
  req.session![CHILD_ID] = undefined;
}

export function childLoggedIn(req: Request): boolean {
  return !!req.session![CHILD_ID];
}

export function getChildId(req: Request): number | null {
  return req.session![CHILD_ID] || null;
}

export async function getChild(req: Request): Promise<Child | undefined> {
  return await getRepository(Child).findOne({
    where: {
      id: getChildId(req),
    },
    relations: ['parents'],
  });
}
