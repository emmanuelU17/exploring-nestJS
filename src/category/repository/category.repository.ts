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
   * Updates a {@link Category} based on unique identifier
   * (primary key). Also updates the parent_id if it is
   * defined in the dto.
   * */
  async updateByCategoryId(dto: UpdateCategoryDto): Promise<void> {
    await super
      .query(`
          UPDATE category c
          SET c.name = ${dto.name}, c.parent_id = (
                CASE WHEN (${dto.parentId} !== ${undefined} OR ${dto.parentId} !== ${null})
                    THEN ${dto.parentId}
                    ELSE c.parent_id
              )
          WHERE c.category_id = ${dto.categoryId}
      `);
  }

}