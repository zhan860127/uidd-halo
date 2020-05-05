import * as express from 'express';
import * as https from 'https';
import * as fs from 'fs';
import { exec } from 'child_process';
import * as request from 'request';
import * as tmp from 'tmp';
import * as passport from 'passport';
import { Strategy } from 'passport-local';
import * as bodyParser from 'body-parser';
import * as session from 'express-session';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
import * as path from 'path';

import * as fileUpload from 'express-fileupload';

import {
  createConnection, getConnection, getRepository, getManager,
} from 'typeorm';

import { Parent } from './models/entity/Parent';
import * as Login from './Login';
import { Child } from './models/entity/Child';
import { newChildToken, randomFilename } from './misc';
import parentRouter from './controllers/parent';
import { ChildAudio } from './models/entity/ChildAudio';

require('reflect-metadata');

dotenv.config();

const port = process.env.HALO_PORT;
if (!port) {
  throw new Error('Port not set. Please edit the .env file');
}

const uploadPath = './uploads';
const ffmpeg = '/home/uidd2020/user/tilde/ffmpeg/build/bin/ffmpeg ';

const LOGIN = {
  PARENT_LOCAL: 'parent_local',
  CHILD_LOCAL: 'child_local',
};

function processBody(s): string | null {
  console.log(s);
  // eslint-disable-next-line no-restricted-syntax
  for (const line of s.split('\n')) {
    if (!line.trim().length) continue;
    const l = JSON.parse(line);
    if (!l.result.length) continue;
    return l.result[0].alternative[0].transcript;
  }
  return null;
}

function getText(path): Promise<string | null> {
  return new Promise((resolve, reject) => {
    request({
      url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=zh-TW&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
      method: 'POST',
      headers: {
        'Content-Type': 'audio/x-flac; rate=44100',
      },
      body: fs.readFileSync(path),
      encoding: null,
    }, (err, res, body) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(processBody(body.toString('utf8')));
    });
  });
}

function ensureParentLoggedIn(req, res, next) {
  if (!Login.parentLoggedIn(req)) return res.redirect('/');
  next();
}

createConnection().then((connection) => {
  const app = express();
  const parentRepo = connection.getRepository(Parent);
  app.use(express.static('html', { extensions: ['html'] }));
  app.use(express.static('dist', { extensions: ['html'] }));
  app.use(session({ secret: 'not secure! TODO put this in env varrr' }));
  app.use(express.static('static/favicon'));
  app.use('/static', express.static('static'));
  app.use(fileUpload());
  app.use(bodyParser.urlencoded({ extended: false }));


  app.set('views', './src/views');
  app.set('view engine', 'pug');
  app.locals.basedir = './src/views';


  passport.use(LOGIN.PARENT_LOCAL, new Strategy(async (username, password, cb) => {
    const user = await parentRepo.findOne({
      username,
    });
    if (!user || !bcrypt.compareSync(password, user.password)) return cb(null, false);
    cb(null, user.id);
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use('/parent', ensureParentLoggedIn, parentRouter(connection));

  app.post('/login', (req, res, next) => {
    passport.authenticate(LOGIN.PARENT_LOCAL, (err, user) => {
      if (err) return next(err);
      if (!user) return res.redirect('sign_in');

      Login.logInParent(req, user);
      res.redirect('/parent/children');
    })(req, res, next);
  });

  app.get('/logout', async (req, res) => {
    Login.logOutParent(req);
    res.redirect('/', 302);
  });

  app.post('/sign_up', async (req, res) => {
    const parent = new Parent();
    parent.email = req.body.email;
    parent.password = bcrypt.hashSync(req.body.password, 10);
    parent.username = req.body.username;
    // TODO: wrap in a transaction
    if (await connection.getRepository(Parent).createQueryBuilder()
      .where('email=:email', { email: parent.email })
      .getCount()) {
      res.send('Email already registered');
      return;
    }
    if (await connection.getRepository(Parent).createQueryBuilder()
      .where('username=:username', { username: parent.username })
      .getCount()) {
      res.send('Username already registered');
      return;
    }
    const newParent = await parentRepo.save(parent);
    req.login(newParent, (err) => {
      if (err) {
        return res.sendStatus(500);
      }
      res.redirect('/dashboard');
    });
  });

  app.post('/speech', async (req, res) => {
    const child = await Login.getChild(req, connection);
    if (!child) return res.sendStatus(401);
    fs.mkdirSync(uploadPath, {recursive: true});
    try {
      const oggFilename = `${randomFilename()}.ogg`;
      const oggPath =  path.join(uploadPath, oggFilename);
      const flacPath = `${tmp.tmpNameSync()}.flac`;
      console.log(oggPath, flacPath);
      const data = req?.files?.data;
      if (!('data' in data)) throw new Error('No file');
      fs.writeFileSync(oggPath, data.data);
      exec(`${ffmpeg} -i '${oggPath}' -ar 44100 ${flacPath}`, async (err) => {
        if (err) throw err;
        const transcript = await getText(flacPath);    
        console.log(transcript);
        if (transcript) {
          const audio = new ChildAudio();
          audio.transcript = transcript;
          audio.child = child;
          audio.path = oggFilename;
          await getManager().save(audio);
        }
        res.json({
          transcript,
        });
        fs.unlinkSync(flacPath);
      });
    } catch (e) {
      console.error(e);
      res.status(401).send('error');
    }
  });

  app.get('/child/enter/:token', async (req, res) => {
    const { token } = req.params;
    if (!token) return res.sendStatus(404);
    const child = await connection.getRepository(Child)
      .findOne({ token });
    if (!child) return res.sendStatus(404);
    Login.logInChild(req, child.id);
    res.redirect(302, '/child');
  });

  app.get('/child', async (req, res) => {
    const child = await Login.getChild(req, connection);
    if (!child) return res.send("you're not logged in")
    res.sendFile('./dist/child_index.html', {root:'.'});
  });


  https.createServer({
    cert: fs.readFileSync('/etc/letsencrypt/live/luffy.ee.ncku.edu.tw/fullchain.pem'),
    key: fs.readFileSync('/etc/letsencrypt/live/luffy.ee.ncku.edu.tw/privkey.pem'),
  }, app).listen(port, async () => {
    console.log(`App listening at https://luffy.ee.ncku.edu.tw:${port}`);
    const tokenlessChildren = await getRepository(Child).find({
      where: [
        { token: null },
        { token: '' },
      ],
    });
    tokenlessChildren.forEach(async (child) => {
      // eslint-disable-next-line no-param-reassign
      child.token = newChildToken();
      await getManager().save(child);
      console.log(`created missing token for child ${child.id}: ${child.token}`);
    });
  });
});
