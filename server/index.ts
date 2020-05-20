import http from 'http';
import https from 'https';
import express from 'express';
import socketIO from 'socket.io';
import session from 'cookie-session';
import { createConnection, getRepository } from 'typeorm';
import { Parent, Child } from '../models/entity/entities';
import api from './api';
import { getChildId, getParentId } from './Login';
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const config = require('../nuxt.config.js').default;
require('dotenv').config();

interface ChildStatus {
  id: number;
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
      id: x.id!,
      name: x.name!,
      online: onlineChildrenIds.has(x.id!),
    }));
  }

  const io = socketIO(server);
  io.use((socket, next) => {
    // @ts-ignore
    sessionMiddleware(socket.request, {}, next);
  });

  const parentSockets: { [id: number]: SocketIO.Socket[] } = {};
  const childPeerIds: {
    [id: number]: string;
  } = {};

  app.locals.parentSockets = parentSockets;

  io.of('/child').on('connection', async (socket) => {
    const childId = getChildId(socket.request);
    if (!childId) {
      socket.disconnect();
      return;
    }
    const child = await getRepository(Child).findOne(childId, {
      relations: ['parents'],
    });
    if (!child) {
      socket.disconnect();
      return;
    }
    console.log(`child ${childId} connected`);

    const parentIds = child!.parents!.map((x) => x.id!);
    function notify() {
      parentIds.forEach(async (pid) => {
        const status = await childrenStatus(pid);
        (parentSockets[pid] || []).forEach((sok) => {
          sok.emit('status', status);
        });
      });
    }
    onlineChildrenIds.add(childId);
    notify();
    socket
      .on('disconnect', () => {
        console.log(`child ${childId} disconnected`);
        delete childPeerIds[childId];
        onlineChildrenIds.delete(childId);
        notify();
      })
      .on('peer_id', (peerId) => {
        childPeerIds[childId] = peerId;
        console.log(`child ${childId} has peer id: ${peerId}`);
      });
  });

  io.of('/parent').on('connection', async (socket) => {
    const parentId = getParentId(socket.request);
    if (!parentId) {
      socket.disconnect();
      return;
    }
    console.log(`parent ${parentId} connected`);
    if (!parentSockets[parentId]) parentSockets[parentId] = [];
    parentSockets[parentId].push(socket);
    socket.emit('status', await childrenStatus(parentId));
    socket.on('disconnect', () => {
      console.log(`parent ${parentId} disconnected`);
      parentSockets[parentId] = parentSockets[parentId].filter(
        (x) => x !== socket
      );
    });
  });

  app.get('/children_status', async (req, res) => {
    const parentId = getParentId(req);
    if (!parentId) return res.status(401).json();
    res.json(await childrenStatus(parentId));
  });

  app.post('/call/:childId', (req, res) => {
    const parentId = getParentId(req);
    if (!parentId) return res.status(403).json();
    const childId = Number.parseInt(req.params.childId);
    const peerId = childPeerIds[childId];
    if (!peerId) return res.status(404).json();
    res.json({ peerId });
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
