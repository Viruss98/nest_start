import { Entity, Column, PrimaryColumn, Index, BaseEntity, DeepPartial, DeleteDateColumn } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, HideField, ID, Field } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';

interface AccessRole {
  userId: number;
  role: string;
}

@ObjectType('Category', {
  description: 'Category',
  implements: [Node],
})
@Entity({
  name: 'categories',
})
export class Category extends BaseEntity implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ length: 500 })
  title: string;

  @Column({
    default: true,
    name:'is_published'
  })
  isPublished: boolean;

  @Column({
    type: 'bigint',
    nullable: false,
    unsigned: true,
    name:'owner_id'
  })
  ownerId: string;

  @HideField()
  @Column({ type: 'jsonb', nullable: true })
  roles: AccessRole[];

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date

  constructor(data: DeepPartial<Category>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}

@ObjectType()
export class CategoryConnection extends PaginationBase(Category) {}

@Entity({
  name: 'categories_access',
})
@Index(['categoryId', 'action', 'userId'], { unique: true })
export class CategoryAccess {
  @PrimaryColumn({ unsigned: true })
  categoryId: number;

  @PrimaryColumn({ length: 50 })
  action: string;

  @PrimaryColumn({ unsigned: true })
  userId: number;

  constructor(data: Partial<CategoryAccess>) {
    Object.assign(this, data);
  }
}
