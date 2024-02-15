import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { Injectable } from '@nestjs/common';
import { CustomNotFoundException } from '../../exception/custom-not-found.exception';
import { InjectRepository } from '@nestjs/typeorm';

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

}