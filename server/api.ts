import express from 'express';
import { getConnection, getRepository, createConnection } from 'typeorm';
import { ConnectionNotFoundError } from 'typeorm/error/ConnectionNotFoundError';
import bcrypt from 'bcrypt';
import bodyParser from 'body-parser';
import session from 'cookie-session';
import passport from 'passport';
import { Strategy } from 'passport-local';
import { Parent, Child } from '../models/entity/entities';
import * as Login from '../server/Login';

import parent from './parent';
import child from './child';

const app = express();

// middlewares
app.use(session({ secret: 'wowee' }));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(async (_req, _res, next) => {
  try {
    await getConnection();
  } catch (e) {
    if (!(e instanceof ConnectionNotFoundError)) throw e;
    await createConnection();
    console.log('db connected');
  }
  next();
});

// subroutes
app.use('/parent', parent);
app.use('/child', child);

// passport stuff
const LOGIN = {
  PARENT_LOCAL: 'parent_local',
  CHILD_LOCAL: 'child_local',
};

passport.use(
  LOGIN.PARENT_LOCAL,
  new Strategy(async (username, password, cb) => {
    const user = await getConnection().getRepository(Parent).findOne({
      username,
    });
    if (user == null || !bcrypt.compareSync(password, user.password!))
      return cb(null, false);
    cb(null, user.id);
  })
);
app.use(passport.initialize());
app.use(passport.session());

// endpoints
app.get('/connect/:token', async (req, res) => {
  const { token } = req.params;
  if (!token) return res.sendStatus(404);
  const child = await getRepository(Child).findOne({ token });
  if (!child) return res.sendStatus(404);
  Login.logInChild(req, child.id!);
  res.redirect(302, '/child');
});

app.get('/child', async (req, res) => {
  const child = await Login.getChild(req);
  if (!child) return res.send("you're not logged in");
  res.sendFile('./dist/child_index.html', { root: '.' });
});

app.post('/login', (req, res, next) => {
  passport.authenticate(LOGIN.PARENT_LOCAL, (err, user) => {
    if (err) return next(err);
    if (!user) return res.redirect('sign_in');

    Login.logInParent(req, user);
    res.redirect('/parent/children');
  })(req, res, next);
});

app.post('/register', async (req, res) => {
  const parent = new Parent();
  parent.email = req.body.email;
  parent.password = bcrypt.hashSync(req.body.password, 10);
  parent.username = req.body.username;
  // TODO: wrap in a transaction
  if (
    await getConnection()
      .getRepository(Parent)
      .createQueryBuilder()
      .where('email=:email', { email: parent.email })
      .getCount()
  ) {
    res.send('Email already registered');
    return;
  }
  if (
    await getConnection()
      .getRepository(Parent)
      .createQueryBuilder()
      .where('username=:username', { username: parent.username })
      .getCount()
  ) {
    res.send('Username already registered');
    return;
  }
  const newParent = await getRepository(Parent).save(parent);
  Login.logInParent(req, newParent.id!);
  res.redirect('/parent/children');
});

export default app;
