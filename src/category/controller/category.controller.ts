import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { API_PREFIX } from '../../util';

@Controller(`${API_PREFIX}category`)
export class CategoryController {

  constructor(private readonly service: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED.valueOf())
  async create(@Body() dto: CreateCategoryDto): Promise<void> {
    await this.service.create(dto);
  }

}
