import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '@/item/entities/item.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn('identity', {
    name: 'category_id',
    type: 'bigint',
    generatedIdentity: 'ALWAYS',
  })
  id: number;

  @Column('varchar', { length: 20, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => Category, (parent) => parent.children)
  @JoinColumn({
    name: 'parent_id',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'category_fk',
  })
  parent?: Category;

  @OneToMany(() => Category, (child) => child.parent, { eager: false })
  children: Promise<Category[]>;

  @OneToMany(() => Item, (item) => item.category, { eager: false })
  items: Promise<Item[]>;
}
