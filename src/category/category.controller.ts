import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { API_PREFIX } from '@/util';
import { CreateCategoryDto, UpdateCategoryDto } from '@/category/category.dto';

@Controller(`${API_PREFIX}category`)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateCategoryDto): Promise<void> {
    await this.service.create(dto);
  }

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(@Body() dto: UpdateCategoryDto): Promise<void> {
    await this.service.update(dto);
  }
}
