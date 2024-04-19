import { MigrationInterface, QueryRunner } from 'typeorm';
import { FileUtil } from './sql/init';

export class V1_migration1708115129502 implements MigrationInterface {

    public async up(runner: QueryRunner): Promise<void> {
      for (const query of FileUtil.READ_FILE('V1__initial.sql')) {
        await runner.query(query);
      }
    }

    public async down(runner: QueryRunner): Promise<void> {
        runner.query(`DROP TABLE IF EXISTS item, category;`);
    }

}
