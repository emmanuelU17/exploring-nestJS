import { Category } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CustomNotFoundException } from '@/exception/custom-not-found.exception';
import { UpdateCategoryDto } from '@/category/dto/update-category.dto';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CategoryRepository extends Repository<Category> {
  constructor(private readonly dataSource: DataSource) {
    super(
      Category,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  async categoryByName(name: string): Promise<Category> {
    const all: Category[] = await super.query(
      `SELECT * FROM category c WHERE c.name = ?`,
      [name],
    );

    if (all) return all[0];

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
      await manager.query(`
          UPDATE category c
          SET c.name = ${dto.name}, c.parent_id = (
                CASE WHEN (${dto.parentId} !== ${undefined} OR ${dto.parentId} !== ${null})
                    THEN ${dto.parentId}
                    ELSE c.parent_id
              )
          WHERE c.category_id = ${dto.categoryId}
      `);
    });
  }
}
