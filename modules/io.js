import http from 'http';
import https from 'https';
import process from 'process';
import socketIO from 'socket.io';

import config from '../nuxt.config';
require('dotenv').config();

export default function () {
  this.nuxt.hook('render:before', () => {
    const server = config.server.https
      ? https.createServer(config.server.https, this.nuxt.renderer.app)
      : http.createServer(this.nuxt.renderer.app);
    const io = socketIO(server);

    // overwrite nuxt.server.listen()
    this.nuxt.server.listen = () =>
      new Promise((resolve) => {
        server.listen(process.env.NUXT_PORT, process.env.NUXT_HOST, resolve);
        return 123;
      });
    // close this server on 'close' event
    this.nuxt.hook('close', () => new Promise(server.close));

    io.on('connection', (client) => {
      console.log('Client connected...');

      client.on('candidate', function (data) {
        'use strict';
        console.log(data);
        client.broadcast.emit('msg', data);
      });

      client.on('sdp', function (data) {
        'use strict';
        console.log(data);
        client.broadcast.emit('msg', data);
      });
    });
  });
}
