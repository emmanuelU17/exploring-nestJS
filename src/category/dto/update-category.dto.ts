import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';
import { Expose } from 'class-transformer';
import { IsDefined, IsNumber } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @Expose({ name: 'category_id' })
  @IsDefined()
  @IsNumber({ allowNaN: false }, { message: 'cannot be negative or null' })
  readonly categoryId: number;
}
