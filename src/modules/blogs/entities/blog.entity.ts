import { Entity, Column, BaseEntity, DeepPartial, DeleteDateColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Node } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';

@ObjectType('Blog', {
  implements: [Node],
})
@Entity({
  name: 'blogs',
})
export class BlogEntity extends BaseEntity implements Node {
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

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date


  constructor(data: DeepPartial<BlogEntity>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}
