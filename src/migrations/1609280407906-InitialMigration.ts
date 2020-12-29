import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1609280407906 implements MigrationInterface {
  name = 'InitialMigration1609280407906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createDatabase(
      queryRunner.connection.options.database as string,
      true
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "salt" character varying NOT NULL, "bio" character varying, "image" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "comments" ("id" SERIAL NOT NULL, "body" character varying NOT NULL, "author_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "article_id" integer, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "articles" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "slug" character varying NOT NULL, "description" character varying, "body" character varying, "author_id" integer NOT NULL, "favorites_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1123ff6815c5b8fec0ba9fec370" UNIQUE ("slug"), CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "subscriptions" ("user_id" integer NOT NULL, "following_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_3d60f435976d197e3d57ccdd403" PRIMARY KEY ("user_id", "following_id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "users_favorites_articles" ("usersId" integer NOT NULL, "articlesId" integer NOT NULL, CONSTRAINT "PK_aebb5070a5fa58957adae6d78af" PRIMARY KEY ("usersId", "articlesId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b3bc5ca3e98f5f3858dbf626ad" ON "users_favorites_articles" ("usersId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_61dc60abcf0035e5ce2aea013b" ON "users_favorites_articles" ("articlesId") `
    );
    await queryRunner.query(
      `CREATE TABLE "articles_tags_tags" ("articlesId" integer NOT NULL, "tagsId" integer NOT NULL, CONSTRAINT "PK_bee9492f5e2157b6dc27fd510bd" PRIMARY KEY ("articlesId", "tagsId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0adb8d108330d74e4a7f7d29de" ON "articles_tags_tags" ("articlesId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dcd523dc6473a35e6cb0cbf9f2" ON "articles_tags_tags" ("tagsId") `
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e9b498cca509147e73808f9e593" FOREIGN KEY ("article_id") REFERENCES "articles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "comments" ADD CONSTRAINT "FK_e6d38899c31997c45d128a8973b" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "articles" ADD CONSTRAINT "FK_6515da4dff8db423ce4eb841490" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_b3bc5ca3e98f5f3858dbf626ad6" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" ADD CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" ADD CONSTRAINT "FK_0adb8d108330d74e4a7f7d29de2" FOREIGN KEY ("articlesId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" ADD CONSTRAINT "FK_dcd523dc6473a35e6cb0cbf9f2d" FOREIGN KEY ("tagsId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" DROP CONSTRAINT "FK_dcd523dc6473a35e6cb0cbf9f2d"`
    );
    await queryRunner.query(
      `ALTER TABLE "articles_tags_tags" DROP CONSTRAINT "FK_0adb8d108330d74e4a7f7d29de2"`
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_61dc60abcf0035e5ce2aea013bc"`
    );
    await queryRunner.query(
      `ALTER TABLE "users_favorites_articles" DROP CONSTRAINT "FK_b3bc5ca3e98f5f3858dbf626ad6"`
    );
    await queryRunner.query(
      `ALTER TABLE "articles" DROP CONSTRAINT "FK_6515da4dff8db423ce4eb841490"`
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e6d38899c31997c45d128a8973b"`
    );
    await queryRunner.query(
      `ALTER TABLE "comments" DROP CONSTRAINT "FK_e9b498cca509147e73808f9e593"`
    );
    await queryRunner.query(`DROP INDEX "IDX_dcd523dc6473a35e6cb0cbf9f2"`);
    await queryRunner.query(`DROP INDEX "IDX_0adb8d108330d74e4a7f7d29de"`);
    await queryRunner.query(`DROP TABLE "articles_tags_tags"`);
    await queryRunner.query(`DROP INDEX "IDX_61dc60abcf0035e5ce2aea013b"`);
    await queryRunner.query(`DROP INDEX "IDX_b3bc5ca3e98f5f3858dbf626ad"`);
    await queryRunner.query(`DROP TABLE "users_favorites_articles"`);
    await queryRunner.query(`DROP TABLE "subscriptions"`);
    await queryRunner.query(`DROP TABLE "articles"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "comments"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.dropDatabase(
      queryRunner.connection.options.database as string,
      true
    );
  }
}
