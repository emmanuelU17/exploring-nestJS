import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CustomNotFoundException } from '@/exception/custom-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateCategoryDto } from '@/category/dto/update-category.dto';

@Injectable()
export class CategoryRepository extends Repository<Category> {

  constructor(
    @InjectRepository(Category)
    private readonly repository: Repository<Category>
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async categoryByName(name: string): Promise<Category> {
    const find = await super
      .query(`SELECT * FROM category c WHERE c.name = ${name}`);

    if (find)
      return find;

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
    await this.repository.manager
      .transaction(async (manage) => {
        await manage
          .query(`
          UPDATE category c
          SET c.name = ${dto.name}, c.parent_id = (
                CASE WHEN (${dto.parentId} !== ${undefined} OR ${dto.parentId} !== ${null})
                    THEN ${dto.parentId}
                    ELSE c.parent_id
              )
          WHERE c.category_id = ${dto.categoryId}
      `);
    })
  }

}