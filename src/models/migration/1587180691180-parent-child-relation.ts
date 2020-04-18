import {MigrationInterface, QueryRunner} from "typeorm";

export class parentChildRelation1587180691180 implements MigrationInterface {
    name = 'parentChildRelation1587180691180'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "parent_children_child" ("parentId" integer NOT NULL, "childId" integer NOT NULL, PRIMARY KEY ("parentId", "childId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_aeeed05e3af387c1da4905b1a5" ON "parent_children_child" ("parentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3e10d4cadccd2d58f11b8e28a6" ON "parent_children_child" ("childId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_aeeed05e3af387c1da4905b1a5"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3e10d4cadccd2d58f11b8e28a6"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_parent_children_child" ("parentId" integer NOT NULL, "childId" integer NOT NULL, CONSTRAINT "FK_aeeed05e3af387c1da4905b1a5d" FOREIGN KEY ("parentId") REFERENCES "parent" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, CONSTRAINT "FK_3e10d4cadccd2d58f11b8e28a6c" FOREIGN KEY ("childId") REFERENCES "child" ("id") ON DELETE CASCADE ON UPDATE NO ACTION, PRIMARY KEY ("parentId", "childId"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_parent_children_child"("parentId", "childId") SELECT "parentId", "childId" FROM "parent_children_child"`, undefined);
        await queryRunner.query(`DROP TABLE "parent_children_child"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_parent_children_child" RENAME TO "parent_children_child"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_aeeed05e3af387c1da4905b1a5" ON "parent_children_child" ("parentId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3e10d4cadccd2d58f11b8e28a6" ON "parent_children_child" ("childId") `, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_3e10d4cadccd2d58f11b8e28a6"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_aeeed05e3af387c1da4905b1a5"`, undefined);
        await queryRunner.query(`ALTER TABLE "parent_children_child" RENAME TO "temporary_parent_children_child"`, undefined);
        await queryRunner.query(`CREATE TABLE "parent_children_child" ("parentId" integer NOT NULL, "childId" integer NOT NULL, PRIMARY KEY ("parentId", "childId"))`, undefined);
        await queryRunner.query(`INSERT INTO "parent_children_child"("parentId", "childId") SELECT "parentId", "childId" FROM "temporary_parent_children_child"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_parent_children_child"`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_3e10d4cadccd2d58f11b8e28a6" ON "parent_children_child" ("childId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_aeeed05e3af387c1da4905b1a5" ON "parent_children_child" ("parentId") `, undefined);
        await queryRunner.query(`DROP INDEX "IDX_3e10d4cadccd2d58f11b8e28a6"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_aeeed05e3af387c1da4905b1a5"`, undefined);
        await queryRunner.query(`DROP TABLE "parent_children_child"`, undefined);
    }

}
