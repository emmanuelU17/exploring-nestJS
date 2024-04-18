import { MigrationInterface, QueryRunner } from "typeorm";

export class V1_migration1708115129502 implements MigrationInterface {

    public async up(runner: QueryRunner): Promise<void> {
        await runner
          .query(`
              CREATE TABLE IF NOT EXISTS category
              (
                  category_id BIGINT UNIQUE NOT NULL AUTO_INCREMENT,
                  name VARCHAR(20) UNIQUE NOT NULL,
                  parent_id BIGINT,
                  PRIMARY KEY (category_id),
                  CONSTRAINT category_fk FOREIGN KEY (parent_id)
                    REFERENCES category (category_id) ON DELETE RESTRICT
              );
          `);

        await runner
          .query(`
              CREATE TABLE IF NOT EXISTS item
              (
                  item_id BIGINT UNIQUE NOT NULL AUTO_INCREMENT,
                  name VARCHAR(30) UNIQUE NOT NULL,
                  price DECIMAL(20, 3) NOT NULL,
                  category_id BIGINT NOT NULL,
                  PRIMARY KEY (item_id),
                  CONSTRAINT item_category_fk FOREIGN KEY (category_id)
                      REFERENCES category (category_id) ON DELETE RESTRICT
              );
          `);
    }

    public async down(runner: QueryRunner): Promise<void> {
        runner.query(`DROP TABLE IF EXISTS item, category;`);
    }

}
