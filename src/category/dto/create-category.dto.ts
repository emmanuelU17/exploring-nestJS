import { IsNotEmpty } from 'class-validator';
import { Expose } from 'class-transformer';

export class CreateCategoryDto {
  @Expose({ name: 'parent_id' })
  readonly parentId: number | undefined | null;

  @IsNotEmpty()
  readonly name: string;
}
