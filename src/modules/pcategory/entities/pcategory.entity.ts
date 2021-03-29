import { Entity, Column, PrimaryColumn, Index, BaseEntity, DeepPartial, DeleteDateColumn, ManyToMany } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, HideField, ID, Field } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import {ProductEntity} from "../../products/entities/products.entity";

interface AccessRole {
  userId: number;
  role: string;
}

@ObjectType('PCategory', {
  description: 'PCategory',
  implements: [Node],
})
@Entity({
  name: 'pcategories',
})
export class PCategory extends BaseEntity implements Node {
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

  @ManyToMany(type => ProductEntity, product => product.categories)
  products: ProductEntity[];

  @HideField()
  @Column({ type: 'jsonb', nullable: true })
  roles: AccessRole[];

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date

  constructor(data: DeepPartial<PCategory>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}

@ObjectType()
export class PCategoryConnection extends PaginationBase(PCategory) {}

@Entity({
  name: 'pcategories_access',
})
@Index(['pcategoryId', 'action', 'userId'], { unique: true })
export class PCategoryAccess {
  @PrimaryColumn({ unsigned: true })
  pcategoryId: number;

  @PrimaryColumn({ length: 50 })
  action: string;

  @PrimaryColumn({ unsigned: true })
  userId: number;

  constructor(data: Partial<PCategoryAccess>) {
    Object.assign(this, data);
  }
}
