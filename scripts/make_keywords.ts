import path from 'path';
import { symlinkSync } from 'fs';
import { getRepository, getManager, createConnection } from 'typeorm';
import { ParentAudio, Child, Parent } from '../models/entity/entities';
import { randomString } from '../server/misc';

require('dotenv').config();

// insert into parent_audio for the first child (first parent)

const uploadPath = process.env.UPLOAD_PATH;
if (!uploadPath) throw new Error('Upload path not set');

async function main() {
  await createConnection();

  const child = (await getRepository(Child).findOne({
    relations: ['parents'],
  })) as Child;
  const parent = child.parents![0] as Parent;
  const linkDst = path.resolve('./scripts/testing_data/audio_long.mp3');

  const keywords = ['你好', '哈囉', '測試', '晚餐'];
  keywords.forEach(async (k) => {
    const linkPath = `${uploadPath}/psym_${randomString('1234567890', 12)}.mp3`;
    symlinkSync(linkDst, linkPath);
    const pa = new ParentAudio();
    pa.child = child;
    pa.parent = parent;
    pa.keyword = k;
    pa.path = linkPath;
    await getManager().save(pa);
    console.log('inserted ', k);
  });
}

main();
