import { MigrationInterface, QueryRunner } from 'typeorm';

export class addChildRecordedAt1589523708213 implements MigrationInterface {
  name = 'addChildRecordedAt1589523708213';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_child_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "transcript" varchar NOT NULL, "path" varchar NOT NULL, "childId" integer, "recordedAt" datetime NOT NULL, CONSTRAINT "FK_74bfb57c18dc15c01c2138a03c2" FOREIGN KEY ("childId") REFERENCES "child" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_child_audio"("id", "createdAt", "updatedAt", "transcript", "path", "childId", "recordedAt") SELECT "id", "createdAt", "updatedAt", "transcript", "path", "childId", "createdAt" FROM "child_audio"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "child_audio"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_child_audio" RENAME TO "child_audio"`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "child_audio" RENAME TO "temporary_child_audio"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "child_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "transcript" varchar NOT NULL, "path" varchar NOT NULL, "childId" integer, CONSTRAINT "FK_74bfb57c18dc15c01c2138a03c2" FOREIGN KEY ("childId") REFERENCES "child" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "child_audio"("id", "createdAt", "updatedAt", "transcript", "path", "childId") SELECT "id", "createdAt", "updatedAt", "transcript", "path", "childId" FROM "temporary_child_audio"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_child_audio"`, undefined);
  }
}
