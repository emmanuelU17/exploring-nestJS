import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateCategoryDto {
  @Expose({ name: 'parent_id' })
  parentId: number | undefined | null;

  @IsNotEmpty()
  name: string;
}
