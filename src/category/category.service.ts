import { Injectable, Logger } from '@nestjs/common';
import { CustomDuplicateException } from '@/exception/custom-duplicate.exception';
import { Category } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CustomNotFoundException } from '@/exception/custom-not-found.exception';
import { CreateCategoryDto, UpdateCategoryDto } from '@/category/category.dto';

@Injectable()
export class CategoryService {
  private static readonly log = new Logger(CategoryService.name);

  constructor(private readonly repository: CategoryRepository) {}

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
      return await this.repository.findOneOrFail({ where: { id: id } });
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

    const category = this.repository.create({ name: dto.name, parent: parent });
    try {
      await this.repository.manager.transaction(
        async (manager) => await manager.save(category),
      );
    } catch (e) {
      CategoryService.log.error('error creating category: ', e);
      throw new CustomDuplicateException(`${dto.name} exists.`);
    }
  }

  async update(dto: UpdateCategoryDto): Promise<void> {
    await this.repository.updateByCategoryId(dto);
  }
}
