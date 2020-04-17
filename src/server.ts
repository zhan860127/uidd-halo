import * as express from 'express'
import * as https from 'https'
import * as fs from 'fs'
import { exec } from "child_process";
import * as request from 'request';
import * as  tmp from 'tmp';
import * as  passport from 'passport';
import * as  bodyParser from 'body-parser';

import * as  fileUpload from 'express-fileupload';
const urlEncodedParser = bodyParser.urlencoded()

require('reflect-metadata');

import { createConnection } from "typeorm";

import { Parent } from './models/entity/Parent';

const port = 8686
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


createConnection().then(connection => {


    const app = express()
    const parentRepo = connection.getRepository(Parent);

    app.use(express.static('html', { extensions: ['html'] }))
    app.use('/static', express.static('static'))
    app.use(fileUpload());

    app.get('/db', async (req, res) => {
        const parents = await parentRepo.find();
        res.json(parents);
    });

    app.post('/sign_up', urlEncodedParser, async (req, res) => {
        console.log(req.body);
        const parent = new Parent();
        parent.email = req.body.email;
        parent.password = req.body.password;
        parent.username = req.body.username;
        await parentRepo.save(parent);
        // TODO: check uniqueness
        res.send('success');
    })

    app.post('/speech', (req, res) => {
        try {
            const path = `${tmp.tmpNameSync()}.ogg`;
            const flacPath = `${tmp.tmpNameSync()}.flac`;
            console.log(path, flacPath);
            fs.writeFileSync(path, req.files.data.data);
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
    }, app).listen(port, () => console.log(`Example app listening at https://localhost:${port}`))


})