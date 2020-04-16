const request = require('request');
const fs = require('fs');

function processBody(s) {
    for (let line of s.split('\n')) {
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

getText(console.log, console.error);


console.log('foo');