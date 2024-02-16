import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { CustomDuplicateException } from '@/exception/custom-duplicate.exception';
import { Category } from '../entities/category.entity';
import { CategoryRepository } from '../repository/category.repository';
import { CustomNotFoundException } from '@/exception/custom-not-found.exception';
import { Item } from '@/item/entities/item.entity';
import { UpdateCategoryDto } from '@/category/dto/update-category.dto';

@Injectable()
export class CategoryService {

  private static readonly log = new Logger(CategoryService.name);

  constructor(
    private readonly repository: CategoryRepository,
  ) {}

  /**
   * Retrieves a specific {@link Category} object by its unique identifier.
   *
   * @param id The unique identifier mapped to a primary key of the
   * category to retrieve.
   * @return A Promise resolving to the retrieved {@link Category} object.
   * @throws {@link NotFoundException} If the requested {@link Category} is
   * not found.
   */
  async categoryById(id: number): Promise<Category> {
    try {
      return await this.repository
        .findOneOrFail({ where: { id: id } });
    } catch (e) {
      throw new CustomNotFoundException('category not found');
    }
  }

  /**
   * Creates a new {@link Category} based on the provided data.
   *
   * @param dto The data transfer object ({@link CreateCategoryDto}) containing
   * information for creating the {@link Category}.
   * @return A Promise that resolves once the category is successfully created.
   * @throws {@link NotFoundException} If the parent category specified in the
   * DTO is not found.
   * @throws {@link CustomDuplicateException} if category name exists.
   */
  async create(dto: CreateCategoryDto): Promise<void> {
    let parent: Category | undefined = undefined;

    if (dto.parentId) {
      parent = await this.categoryById(dto.parentId);
    }

    try {
      const category = this.repository
        .create({
          name: dto.name,
          parent: parent,
          children: [] as Category[],
          items: [] as Item[]
        })

      await this.repository.manager
        .transaction(async (manager) => {
          await manager.save(category);
        })
    } catch (e) {
      CategoryService.log.error('error creating category: ', e);
      throw new CustomDuplicateException(`${dto.name} exists.`);
    }
  }

  async update(dto: UpdateCategoryDto): Promise<void> {
    await this.repository.updateByCategoryId(dto);
  }

}
