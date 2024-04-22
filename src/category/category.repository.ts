import { Category } from './category.entity';
import { Injectable } from '@nestjs/common';
import { CustomNotFoundException } from '@/exception/custom-not-found.exception';
import { DataSource, Repository } from 'typeorm';
import { ICategory } from '@/category/category.db-mapper';
import { UpdateCategoryDto } from '@/category/category.dto';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(
      Category,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  async categoryByName(name: string): Promise<ICategory> {
    const res: ICategory[] = await super.query(
      `SELECT * FROM category WHERE name = '${name}'`,
    );

    if (res) return res[0];

    throw new CustomNotFoundException(`${name} does not exist`);
  }

  /**
   * Updates a {@link Category} based on its unique identifier (primary key).
   * This method allows for modifying the category's name and parent category ID.
   * If a parent category ID is provided in the DTO, it will be updated accordingly.
   * Note that this operation is transactional, ensuring data consistency and rollback
   * in case of errors.
   *
   * @param dto The DTO (Data Transfer Object) containing the update information,
   *            including the category ID, new name, and optional parent category ID.
   * @returns A Promise that resolves once the update operation is successfully completed.
   *          It does not return any value.
   */
  async updateByCategoryId(dto: UpdateCategoryDto): Promise<void> {
    await this.dataSource.manager.transaction(async (manager) => {
      const bool = !!dto.parentId;

      const query = `
          UPDATE category c
          SET c.name      = '${dto.name}',
              c.parent_id = CASE WHEN ${bool} THEN ${dto.parentId} ELSE NULL END
          WHERE c.category_id = ${dto.categoryId};`;

      await manager.query(query);
    });
  }
}
