import { Expose } from 'class-transformer';
import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateItemDto {
  @Expose({ name: 'category_id' })
  readonly categoryId: number;

  @IsDefined()
  @IsNotEmpty()
  readonly name: string;

  @IsNumber({ allowNaN: false }, { message: 'cannot be negative or null' })
  @IsDefined()
  readonly price: number;
}
