import { Entity, Column, BaseEntity, DeepPartial, DeleteDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Node } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import {PCategory} from "../../pcategory/entities/pcategory.entity";

@ObjectType('Product', {
  implements: [Node],
})
@Entity({
  name: 'products',
})
export class ProductEntity extends BaseEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ length: 500, comment: 'Title of blog' })
  title: string;

  @Column('text', {
    comment: 'Content of blog',
  })
  content: string;

  @Field(() => Int)
  @Column('int', {
    default: 0,
    comment: 'Total view by client',
  })
  views: number;

  @Column({
    default: true,
    comment: 'Set published',
    name:'is_published'
  })
  isPublished: boolean;

  @ManyToMany(() => PCategory, category => category.products, {
    cascade: true
  })
  @JoinTable()
  categories: PCategory[];

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date


  constructor(data: DeepPartial<ProductEntity>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}
