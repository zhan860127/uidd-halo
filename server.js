const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const { exec } = require("child_process");
const request = require('request');

const fileUpload = require('express-fileupload');


const port = 5999
const ffmpeg = '/home/uidd2020/user/tilde/ffmpeg/build/bin/ffmpeg ';

function processBody(s) {
    for (let line of s.split('\n')) {
        if (!line.trim().length) continue;
        const s = JSON.parse(line);
        if (!s.result.length) continue;
        return s.result[0].alternative[0].transcript;
    }
}

function getText(resolve, reject) {
    request({
        url: 'https://www.google.com/speech-api/v2/recognize?output=json&lang=zh-TW&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
        method: 'POST',
        headers: {
            'Content-Type': 'audio/x-flac; rate=44100'
        },
        body: fs.readFileSync('out.flac'),
        encoding: null,
    }, function(err, res, body) {
        if (err) reject(err);
        else resolve(processBody(body.toString('utf8')));
    });
}



app.use(express.static('static'))
app.use(fileUpload());

app.get('/', (req, res) => res.send('Hello World!'))
app.post('/speech', (req, res) => {
    try {
        const path = './out.ogg';
        const flacpath = './out.flac';
        console.log(req.files);
        fs.unlink(flacpath, (e) => { if (e) throw e });
        fs.writeFileSync(path, req.files.data.data);
        exec(`${ffmpeg} -i ${path} -ar 44100 ${flacpath}`, err => {
            if (err) throw err;
            getText((transcript) => {
                console.log(transcript);
                res.json({
                    transcript,
                })
            }, (err) => {
                throw err;
            })
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