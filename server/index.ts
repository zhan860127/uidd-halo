import http from 'http';
import https from 'https';
import api from './api';
const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const app = express();
const config = require('../nuxt.config.js').default;
require('dotenv').config();

// Import and Set Nuxt.js options
config.dev = process.env.NODE_ENV !== 'production';

async function start() {
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
  const httpsOpts = config.server?.https;
  const server = httpsOpts
    ? https.createServer(httpsOpts, app)
    : http.createServer(app);

  const scheme = `http${httpsOpts ? 's' : ''}`;

  // Listen the server
  server.listen(port, host);
  consola.ready({
    message: `Server listening on ${scheme}://${host}:${port}`,
    badge: true,
  });
}
start();
