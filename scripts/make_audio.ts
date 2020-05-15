import path from 'path';
import { symlinkSync } from 'fs';
import { createConnection, getRepository, getManager } from 'typeorm';
import { Child, ChildAudio } from '../models/entity/entities';
import { randomString } from '../server/misc';

require('dotenv').config();

// insert child_audio for the first child in the database
// select 80 days in the past year
// for each day put 1-10 clips in it

const uploadPath = process.env.UPLOAD_PATH;
if (!uploadPath) throw new Error('Upload path not set');

const nDays = 80;
const nClipsMax = 10;

function getRandomSubarray<T>(arr: Array<T>, size: number) {
  const shuffled = arr.slice(0);
  let i = arr.length;
  const min = i - size;
  let temp;
  let index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}

async function main() {
  await createConnection();
  const allDays = new Array(365).fill(0).map((_v, i) => i);
  const days = getRandomSubarray(allDays, nDays);
  const child = await getRepository(Child).findOne();
  if (!child) throw new Error('child not found');

  const linkDst = path.resolve('./scripts/testing_data/audio_long.mp3');

  days.forEach(async (d) => {
    const date = new Date();
    date.setDate(date.getDate() - d - 1);
    const nClips = Math.ceil(Math.random() * nClipsMax);
    for (let i = 0; i < nClips; ++i) {
      date.setHours(0, 0, 0, 0);
      date.setSeconds(24 * 60 * 60 * Math.random());
      const ca = new ChildAudio();
      ca.transcript =
        '測試音檔補字數補字數補字數 啦啦啦 啦啦啦 啦啦啦 啦啦啦 啦啦啦';
      ca.child = child;
      const linkPath = `${uploadPath}/sym_${randomString(
        '1234567890',
        12
      )}.mp3`;
      symlinkSync(linkDst, linkPath);
      ca.path = linkPath;
      ca.recordedAt = date;
      await getManager().save(ca);
    }
    console.log(`Saved ${nClips} on ${date}`);
  });
}

main();
