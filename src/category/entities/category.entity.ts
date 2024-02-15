import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Item } from '../../item/entities/item.entity';

@Entity({ name: 'category' })
export class Category {

  @PrimaryGeneratedColumn('identity', { name: 'category_id', type: 'bigint', generatedIdentity: 'ALWAYS' })
  id: number;

  @Column('varchar', { length: 50, nullable: false, unique: true })
  name: string;

  @ManyToOne(() => Category, (parent) => parent.children)
  @JoinColumn({ name: 'parent_id', referencedColumnName: 'id' })
  parent?: Category;

  @OneToMany(() => Category, (child) => child.parent)
  children: Category[];

  @OneToMany(() => Item, (item) => item.category)
  items: Item[];

}