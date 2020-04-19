import * as express from 'express'
import * as https from 'https'
import * as fs from 'fs'
import { exec } from "child_process";
import * as request from 'request';
import * as  tmp from 'tmp';
import * as  passport from 'passport';
import { Strategy } from 'passport-local';
import * as  bodyParser from 'body-parser';
import * as session from 'express-session'
import * as cookieSession from 'cookie-session';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv'

import * as  fileUpload from 'express-fileupload';

require('reflect-metadata');

import { createConnection, Db, getRepository } from "typeorm";

import { Parent } from './models/entity/Parent';
import { Child } from './models/entity/Child';

dotenv.config();

const port = process.env.HALO_PORT;
if (!port) {
    throw 'Port not set. Please edit the .env file';
}

const ffmpeg = '/home/uidd2020/user/tilde/ffmpeg/build/bin/ffmpeg ';

function processBody(s) {
    console.log(s);
    for (let line of s.split('\n')) {
        if (!line.trim().length) continue;
        const s = JSON.parse(line);
        if (!s.result.length) continue;
        return s.result[0].alternative[0].transcript;
    }
}

function getText(path) {
    return new Promise((resolve, reject) => {
        request({
            url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=zh-TW&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
            method: 'POST',
            headers: {
                'Content-Type': 'audio/x-flac; rate=44100'
            },
            body: fs.readFileSync(path),
            encoding: null,
        }, function (err, res, body) {
            if (err) {
                reject(err);
                return;
            }
            resolve(processBody(body.toString('utf8')));
        });
    });
}

function ensureLoggedIn(req, res, next) {
    if (!req.user) res.redirect('/')
    else next();
}

createConnection().then(connection => {


    const app = express()
    const parentRepo = connection.getRepository(Parent);

    app.use(express.static('html', { extensions: ['html'] }))
    app.use(cookieSession({ secret: "not secure! TODO put this in env var" }));
    app.use('/static', express.static('static'))
    app.use(fileUpload());
    app.use(bodyParser.urlencoded({ extended: false }));


    app.set('views', './src/views')
    app.set('view engine', 'pug')
    app.locals.basedir = './src/views';


    passport.use(new Strategy(async (username, password, cb) => {
        const user = await parentRepo.findOne({
            username,
        })
        if (!user || !bcrypt.compareSync(password, user.password)) return cb(null, false);
        cb(null, user);
    }));

    passport.serializeUser(function (user, cb) {
        cb(null, (user as Parent).id);
    });

    passport.deserializeUser(async function (id, cb) {
        const user = await parentRepo.findOne(id);
        if (!user) return cb('err', false);
        cb(null, user);
    });

    app.use(passport.initialize());
    app.use(passport.session());


    app.get('/dashboard',
        ensureLoggedIn,
        async (req, res) => {
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
        });

    app.get('/child/:childId', ensureLoggedIn, async (req, res) => {
        const child = await connection.getRepository(Child)
            .createQueryBuilder('child')
            .innerJoinAndSelect('child.parents', 'parent')
            .where('parent.id = :parentId', { parentId: (req.user as Parent).id })
            .andWhere('child.id = :childId', { childId: req.params.childId })
            .getOne();
        if (!child) return res.sendStatus(404);
        res.render('function_select', { child })
    });

    app.post('/login',
        passport.authenticate('local', {
            failureRedirect: '/sign_in',
            successRedirect: '/dashboard'
        }));

    app.get('/logout', async (req, res) => {
        req.logout();
        res.redirect('/', 302);
    });

    app.post('/sign_up', async (req, res) => {
        console.log(req.body);
        const parent = new Parent();
        parent.email = req.body.email;
        parent.password = bcrypt.hashSync(req.body.password, 10);
        parent.username = req.body.username;
        await parentRepo.save(parent);
        // TODO: check uniqueness
        res.send('success');
    })

    app.post('/add_child',
        ensureLoggedIn,
        async (req, res) => {
            if (!req.body.name) {
                res.status(400);
                return res.send('no name sent');
            }
            const parent = await connection
                .getRepository(Parent)
                .findOne({
                    where: {
                        id: (req.user as Parent).id,
                    },
                    relations: ['children'],
                });
            if (!parent) {
                return res.sendStatus(500);
            }
            const child = new Child();
            child.name = req.body.name;
            await connection.manager.save(child);
            parent.children.push(child);
            await connection.manager.save(parent);
            res.redirect(302, '/dashboard');
        });

    app.post('/speech', (req, res) => {
        try {
            const path = `${tmp.tmpNameSync()}.ogg`;
            const flacPath = `${tmp.tmpNameSync()}.flac`;
            console.log(path, flacPath);
            const data = req?.files?.data;
            if (!('data' in data)) throw 'No file';
            fs.writeFileSync(path, data);
            exec(`${ffmpeg} -i ${path} -ar 44100 ${flacPath}`, err => {
                if (err) throw err;
                getText(flacPath).then(
                    (transcript) => {
                        console.log(transcript);
                        res.json({
                            transcript,
                        })
                    }
                ).catch(err => { throw err }).finally(() => {
                    fs.unlinkSync(path);
                    fs.unlinkSync(flacPath);
                });
            });
        } catch (e) {
            console.error(e);
            res.status(401).send('error');
        }
    })



    https.createServer({
        cert: fs.readFileSync('/etc/letsencrypt/live/luffy.ee.ncku.edu.tw/fullchain.pem'),
        key: fs.readFileSync('/etc/letsencrypt/live/luffy.ee.ncku.edu.tw/privkey.pem'),
    }, app).listen(port, () => console.log(`App listening at https://luffy.ee.ncku.edu.tw:${port}`))


})