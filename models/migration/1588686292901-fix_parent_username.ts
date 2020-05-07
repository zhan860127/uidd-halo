import {MigrationInterface, QueryRunner} from "typeorm";

export class fixParentUsername1588686292901 implements MigrationInterface {
    name = 'fixParentUsername1588686292901'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_2a30eee24d4bf9c5ff1d31dab20" UNIQUE ("imageId"), CONSTRAINT "FK_2a30eee24d4bf9c5ff1d31dab20" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_parent"("id", "email", "password", "username", "createdAt", "updatedAt", "imageId") SELECT "id", "email", "password", "username", "createdAt", "updatedAt", "imageId" FROM "parent"`, undefined);
        await queryRunner.query(`DROP TABLE "parent"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_parent" RENAME TO "parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" varchar NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_2a30eee24d4bf9c5ff1d31dab20" UNIQUE ("imageId"), CONSTRAINT "FK_2a30eee24d4bf9c5ff1d31dab20" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_parent"("id", "email", "password", "username", "createdAt", "updatedAt", "imageId") SELECT "id", "email", "password", "username", "createdAt", "updatedAt", "imageId" FROM "parent"`, undefined);
        await queryRunner.query(`DROP TABLE "parent"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_parent" RENAME TO "parent"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "parent" RENAME TO "temporary_parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_2a30eee24d4bf9c5ff1d31dab20" UNIQUE ("imageId"), CONSTRAINT "FK_2a30eee24d4bf9c5ff1d31dab20" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "parent"("id", "email", "password", "username", "createdAt", "updatedAt", "imageId") SELECT "id", "email", "password", "username", "createdAt", "updatedAt", "imageId" FROM "temporary_parent"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_parent"`, undefined);
        await queryRunner.query(`ALTER TABLE "parent" RENAME TO "temporary_parent"`, undefined);
        await queryRunner.query(`CREATE TABLE "parent" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "username" integer NOT NULL, "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "imageId" integer, CONSTRAINT "UQ_2a30eee24d4bf9c5ff1d31dab20" UNIQUE ("imageId"), CONSTRAINT "FK_2a30eee24d4bf9c5ff1d31dab20" FOREIGN KEY ("imageId") REFERENCES "image" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "parent"("id", "email", "password", "username", "createdAt", "updatedAt", "imageId") SELECT "id", "email", "password", "username", "createdAt", "updatedAt", "imageId" FROM "temporary_parent"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_parent"`, undefined);
    }

}
