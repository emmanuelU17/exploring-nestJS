import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '@/category/category.entity';

@Entity({ name: 'item' })
export class Item {
  @PrimaryGeneratedColumn('identity', {
    name: 'item_id',
    type: 'bigint',
    generatedIdentity: 'ALWAYS',
  })
  id: number;

  @Column('varchar', { length: 30, nullable: false, unique: true })
  name: string;

  @Column('decimal', { nullable: false })
  price: number;

  @ManyToOne(() => Category, (cat) => cat.items)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;
}
