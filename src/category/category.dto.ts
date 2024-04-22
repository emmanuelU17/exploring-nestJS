import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCategoryDto {
  @Expose({ name: 'parent_id' })
  readonly parentId: number | null;

  @IsNotEmpty()
  readonly name: string;
}

export class UpdateCategoryDto {
  @Expose({ name: 'category_id' })
  @IsDefined()
  @IsNumber({ allowNaN: false }, { message: 'cannot be negative or null' })
  readonly categoryId: number;

  @Expose({ name: 'parent_id' })
  readonly parentId: number | null;

  @IsNotEmpty()
  readonly name: string;
}
