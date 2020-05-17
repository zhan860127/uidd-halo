import path from 'path';
import { writeFile, readFile, unlink, mkdir } from 'fs';
import { promisify } from 'util';
import { exec } from 'child_process';
import { Router, RequestHandler } from 'express';
import multer from 'multer';
import { config } from 'dotenv';
import tmp from 'tmp';
import axios from 'axios';
import { getManager } from 'typeorm';
import { ChildAudio } from '../models/entity/entities';
import { childLoggedIn, getChild } from './Login';
import { randomFilename } from './misc';

config();
const uploadPath = process.env.UPLOAD_PATH;
const ffmpeg = process.env.FFMPEG;

if (!uploadPath)
  throw new Error('Upload path not set. Please edit the .env file');
if (!ffmpeg) throw new Error('ffmpeg path not set. Please edit the .env file');

const upload = multer();
const router = Router();
const ensureChildLoggedIn: RequestHandler = (req, res, next) => {
  if (!childLoggedIn(req)) return res.sendStatus(401);
  next();
};

async function getAudioTranscript(
  filename: string
): Promise<string | undefined> {
  const data = await promisify(readFile)(filename);
  const res = await axios.post(
    'https://www.google.com/speech-api/v2/recognize?output=json&lang=zh-TW&key=AIzaSyBOti4mM-6x9WDnZIjIeyEU21OpBXqWBgw',
    data,
    {
      headers: {
        'Content-Type': 'audio/x-flac; rate=44100',
      },
      responseType: 'text',
      transformResponse: [],
    }
  );

  const s: string = res.data;

  // response seems to be newline separated json
  for (const line of s.split('\n')) {
    if (!line.trim().length) continue;
    const l = JSON.parse(line);
    if (!l.result.length) continue;
    return l.result[0].alternative[0].transcript;
  }
  return undefined;
}

router.use(ensureChildLoggedIn);

router.get('/me', async (req, res) => {
  const child = await getChild(req);
  if (!child) return res.sendStatus(404);
  res.json({
    name: child.name!,
  });
});

router.post('/speech', upload.single('data'), async (req, res) => {
  const date = new Date();
  const child = await getChild(req);
  if (!child) return res.sendStatus(404);

  // save the file
  const buffer = req.file.buffer;
  await promisify(mkdir)(uploadPath, { recursive: true });
  const oggFilename = `${randomFilename()}.ogg`;
  const oggPath = path.join(uploadPath!, oggFilename);
  const flacPath = `${tmp.tmpNameSync()}.flac`;
  await promisify(writeFile)(oggPath, buffer);

  // make flac
  await promisify(exec)(`${ffmpeg} -i '${oggPath}' -ar 44100 ${flacPath}`);
  // send to google
  const transcript = await getAudioTranscript(flacPath);

  await promisify(unlink)(flacPath);
  res.json({ transcript });

  if (!transcript) {
    await promisify(unlink)(oggPath);
    return;
  }

  // resave as mp3 to fix metadata
  const mp3Path = path.join(uploadPath!, `${randomFilename()}.mp3`);
  await promisify(exec)(`${ffmpeg} -i '${oggPath}' '${mp3Path}'`);
  await promisify(unlink)(oggPath);
  const ca = new ChildAudio();
  ca.transcript = transcript;
  ca.child = child;
  ca.path = mp3Path;
  ca.recordedAt = date;
  await getManager().save(ca);
});

export default router;
