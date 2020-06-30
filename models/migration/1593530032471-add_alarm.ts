import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAlarm1593530032471 implements MigrationInterface {
  name = 'addAlarm1593530032471';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "alarm_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "parentId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "hour" integer NOT NULL, "minute" integer NOT NULL, "repeats" text NOT NULL, "childId" integer, "audioId" integer)`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_alarm_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "parentId" integer, CONSTRAINT "FK_b47b2ad27aa6b2987e546ab29ea" FOREIGN KEY ("parentId") REFERENCES "parent" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_alarm_audio"("id", "createdAt", "updatedAt", "path", "parentId") SELECT "id", "createdAt", "updatedAt", "path", "parentId" FROM "alarm_audio"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "alarm_audio"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_alarm_audio" RENAME TO "alarm_audio"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "hour" integer NOT NULL, "minute" integer NOT NULL, "repeats" text NOT NULL, "childId" integer, "audioId" integer, CONSTRAINT "FK_506f4a9857f34837ae1620c86b4" FOREIGN KEY ("childId") REFERENCES "child" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_1bcb3ea8acc1a6fd06d7d0bc553" FOREIGN KEY ("audioId") REFERENCES "alarm_audio" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "temporary_alarm"("id", "createdAt", "updatedAt", "hour", "minute", "repeats", "childId", "audioId") SELECT "id", "createdAt", "updatedAt", "hour", "minute", "repeats", "childId", "audioId" FROM "alarm"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "alarm"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "temporary_alarm" RENAME TO "alarm"`,
      undefined
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "alarm" RENAME TO "temporary_alarm"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "alarm" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "hour" integer NOT NULL, "minute" integer NOT NULL, "repeats" text NOT NULL, "childId" integer, "audioId" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "alarm"("id", "createdAt", "updatedAt", "hour", "minute", "repeats", "childId", "audioId") SELECT "id", "createdAt", "updatedAt", "hour", "minute", "repeats", "childId", "audioId" FROM "temporary_alarm"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_alarm"`, undefined);
    await queryRunner.query(
      `ALTER TABLE "alarm_audio" RENAME TO "temporary_alarm_audio"`,
      undefined
    );
    await queryRunner.query(
      `CREATE TABLE "alarm_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL, "parentId" integer)`,
      undefined
    );
    await queryRunner.query(
      `INSERT INTO "alarm_audio"("id", "createdAt", "updatedAt", "path", "parentId") SELECT "id", "createdAt", "updatedAt", "path", "parentId" FROM "temporary_alarm_audio"`,
      undefined
    );
    await queryRunner.query(`DROP TABLE "temporary_alarm_audio"`, undefined);
    await queryRunner.query(`DROP TABLE "alarm"`, undefined);
    await queryRunner.query(`DROP TABLE "alarm_audio"`, undefined);
  }
}
