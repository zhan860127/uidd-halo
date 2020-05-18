import http from 'http';
import https from 'https';
import express from 'express';
import socketIO from 'socket.io';
import session from 'cookie-session';
import { createConnection, getRepository } from 'typeorm';
import { Parent } from '../models/entity/entities';
import api from './api';
import { getChildId, getParentId } from './Login';
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const config = require('../nuxt.config.js').default;
require('dotenv').config();

interface ChildStatus {
  name: string;
  online: boolean;
}

async function start() {
  await createConnection();

  // Import and Set Nuxt.js options
  config.dev = process.env.NODE_ENV !== 'production';

  const httpsOpts = config.server?.https;
  const server = httpsOpts
    ? https.createServer(httpsOpts, app)
    : http.createServer(app);

  const scheme = `http${httpsOpts ? 's' : ''}`;

  const sessionMiddleware = session({ secret: 'wowee' });

  app.use(sessionMiddleware);

  const onlineChildrenIds = new Set<number>();
  app.locals.onlineChildrenIds = onlineChildrenIds;

  async function childrenStatus(
    parentId: number
  ): Promise<ChildStatus[] | null> {
    const parent = await getRepository(Parent).findOne(parentId, {
      relations: ['children'],
    });
    if (!parent) return null;
    return parent.children!.map((x) => ({
      name: x.name!,
      online: onlineChildrenIds.has(x.id!),
    }));
  }

  const io = socketIO(server);
  io.use((socket, next) => {
    // @ts-ignore
    sessionMiddleware(socket.request, {}, next);
  });

  io.on('connection', (socket) => {
    const childId = getChildId(socket.request);
    if (childId) {
      console.log(`child ${childId} connected`);
      onlineChildrenIds.add(childId);
      socket.on('disconnect', () => {
        console.log(`child ${childId} disconnected`);
        onlineChildrenIds.delete(childId);
      });
      return;
    }
    const parentId = getParentId(socket.request);
    if (parentId) {
      console.log(`child ${parentId} connected`);
      socket.on('disconnect', () => {
        console.log(`parent ${parentId} disconnected`);
      });
      return;
    }
    // not child and not parent
    socket.disconnect();
  });

  app.get('/children_status', async (req, res) => {
    const parentId = getParentId(req);
    if (!parentId) return res.status(401).json();
    res.json(await childrenStatus(parentId));
  });

  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  const host = process.env.NUXT_HOST || nuxt.options.server.host;
  const port = process.env.NUXT_PORT || nuxt.options.server.port;

  await nuxt.ready();
  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use('/api', api);
  app.use(nuxt.render);

  // Listen the server
  server.listen(port, host);
  consola.ready({
    message: `Server listening on ${scheme}://${host}:${port}`,
    badge: true,
  });
}
start();
