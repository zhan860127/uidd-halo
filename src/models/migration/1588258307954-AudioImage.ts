import {MigrationInterface, QueryRunner} from "typeorm";

export class AudioImage1588258307954 implements MigrationInterface {
    name = 'AudioImage1588258307954'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "image" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "path" varchar NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "parent_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "keyword" varchar NOT NULL, "path" varchar NOT NULL, "parentId" integer, "childId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "child_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "transcript" varchar NOT NULL, "path" varchar NOT NULL, "childId" integer)`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_5771564c89d1c5a782ce4c1bfc6" UNIQUE ("imageId"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_parent"("id", "email", "password", "username", "createdAt", "updatedAt") SELECT "id", "email", "password", "username", "createdAt", "updatedAt" FROM "parent"`, undefined);
        await queryRunner.query(`DROP TABLE "parent"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_parent" RENAME TO "parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_child" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "token" varchar NOT NULL DEFAULT (''), "imageId" integer, CONSTRAINT "UQ_80e6bb10175e20f0368a0244dc8" UNIQUE ("imageId"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_child"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "child"`, undefined);
        await queryRunner.query(`DROP TABLE "child"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_child" RENAME TO "child"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_parent_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "keyword" varchar NOT NULL, "path" varchar NOT NULL, "parentId" integer, "childId" integer, CONSTRAINT "FK_5481a6cffea2f7f74834af51505" FOREIGN KEY ("parentId") REFERENCES "parent" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_6e4f2a5c0f655393af5addd5007" FOREIGN KEY ("childId") REFERENCES "child" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_parent_audio"("id", "createdAt", "updatedAt", "keyword", "path", "parentId", "childId") SELECT "id", "createdAt", "updatedAt", "keyword", "path", "parentId", "childId" FROM "parent_audio"`, undefined);
        await queryRunner.query(`DROP TABLE "parent_audio"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_parent_audio" RENAME TO "parent_audio"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_5771564c89d1c5a782ce4c1bfc6" UNIQUE ("imageId"), CONSTRAINT "FK_2a30eee24d4bf9c5ff1d31dab20" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_parent"("id", "email", "password", "username", "createdAt", "updatedAt", "imageId") SELECT "id", "email", "password", "username", "createdAt", "updatedAt", "imageId" FROM "parent"`, undefined);
        await queryRunner.query(`DROP TABLE "parent"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_parent" RENAME TO "parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_child_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "transcript" varchar NOT NULL, "path" varchar NOT NULL, "childId" integer, CONSTRAINT "FK_74bfb57c18dc15c01c2138a03c2" FOREIGN KEY ("childId") REFERENCES "child" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_child_audio"("id", "createdAt", "updatedAt", "transcript", "path", "childId") SELECT "id", "createdAt", "updatedAt", "transcript", "path", "childId" FROM "child_audio"`, undefined);
        await queryRunner.query(`DROP TABLE "child_audio"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_child_audio" RENAME TO "child_audio"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_child" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "token" varchar NOT NULL DEFAULT (''), "imageId" integer, CONSTRAINT "UQ_80e6bb10175e20f0368a0244dc8" UNIQUE ("imageId"), CONSTRAINT "FK_cebf8e97de3736714666fbeb527" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_child"("id", "name", "createdAt", "updatedAt", "token", "imageId") SELECT "id", "name", "createdAt", "updatedAt", "token", "imageId" FROM "child"`, undefined);
        await queryRunner.query(`DROP TABLE "child"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_child" RENAME TO "child"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "child" RENAME TO "temporary_child"`, undefined);
        await queryRunner.query(`CREATE TABLE "child" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "token" varchar NOT NULL DEFAULT (''), "imageId" integer, CONSTRAINT "UQ_80e6bb10175e20f0368a0244dc8" UNIQUE ("imageId"))`, undefined);
        await queryRunner.query(`INSERT INTO "child"("id", "name", "createdAt", "updatedAt", "token", "imageId") SELECT "id", "name", "createdAt", "updatedAt", "token", "imageId" FROM "temporary_child"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_child"`, undefined);
        await queryRunner.query(`ALTER TABLE "child_audio" RENAME TO "temporary_child_audio"`, undefined);
        await queryRunner.query(`CREATE TABLE "child_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "transcript" varchar NOT NULL, "path" varchar NOT NULL, "childId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "child_audio"("id", "createdAt", "updatedAt", "transcript", "path", "childId") SELECT "id", "createdAt", "updatedAt", "transcript", "path", "childId" FROM "temporary_child_audio"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_child_audio"`, undefined);
        await queryRunner.query(`ALTER TABLE "parent" RENAME TO "temporary_parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_5771564c89d1c5a782ce4c1bfc6" UNIQUE ("imageId"))`, undefined);
        await queryRunner.query(`INSERT INTO "parent"("id", "email", "password", "username", "createdAt", "updatedAt", "imageId") SELECT "id", "email", "password", "username", "createdAt", "updatedAt", "imageId" FROM "temporary_parent"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_parent"`, undefined);
        await queryRunner.query(`ALTER TABLE "parent_audio" RENAME TO "temporary_parent_audio"`, undefined);
        await queryRunner.query(`CREATE TABLE "parent_audio" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "keyword" varchar NOT NULL, "path" varchar NOT NULL, "parentId" integer, "childId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "parent_audio"("id", "createdAt", "updatedAt", "keyword", "path", "parentId", "childId") SELECT "id", "createdAt", "updatedAt", "keyword", "path", "parentId", "childId" FROM "temporary_parent_audio"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_parent_audio"`, undefined);
        await queryRunner.query(`ALTER TABLE "child" RENAME TO "temporary_child"`, undefined);
        await queryRunner.query(`CREATE TABLE "child" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`, undefined);
        await queryRunner.query(`INSERT INTO "child"("id", "name", "createdAt", "updatedAt") SELECT "id", "name", "createdAt", "updatedAt" FROM "temporary_child"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_child"`, undefined);
        await queryRunner.query(`ALTER TABLE "parent" RENAME TO "temporary_parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')))`, undefined);
        await queryRunner.query(`INSERT INTO "parent"("id", "email", "password", "username", "createdAt", "updatedAt") SELECT "id", "email", "password", "username", "createdAt", "updatedAt" FROM "temporary_parent"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_parent"`, undefined);
        await queryRunner.query(`DROP TABLE "child_audio"`, undefined);
        await queryRunner.query(`DROP TABLE "parent_audio"`, undefined);
        await queryRunner.query(`DROP TABLE "image"`, undefined);
    }

}
