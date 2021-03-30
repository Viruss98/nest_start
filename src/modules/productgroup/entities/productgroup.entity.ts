import { Entity, Column, PrimaryColumn, Index, BaseEntity, DeepPartial, DeleteDateColumn, ManyToMany,RelationId, JoinTable } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, HideField, ID, Field } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import {ProductEntity} from "../../products/entities/products.entity";

interface AccessRole {
  userId: number;
  role: string;
}

@ObjectType('ProductGroup', {
  description: 'ProductGroup',
  implements: [Node],
})
@Entity({
  name: 'productgroups',
})
export class ProductGroup extends BaseEntity implements Node {
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

  // @RelationId((productGroup: ProductGroup) => productGroup.products)
  // @Field(() => [ID], {nullable: true, defaultValue: []})
  // productIds: string[];
  // // @ManyToMany(() => ProductGroup, category => category.products, {
  // //   cascade: true
  // // })
  // @ManyToMany(type => ProductEntity, product => product.productGroups)
  // @JoinTable({
  //   name: "products_groups_relation",
  //   joinColumn: {
  //     name: "productGroupsId",
  //     referencedColumnName: "id"
  //   },
  //   inverseJoinColumn: {
  //     name: "productsId",
  //     referencedColumnName: "id"
  //   }
  // })
  // @Field(() => [ProductEntity], {nullable: true, defaultValue: []})
  // products?: ProductEntity[] | null;
  // books: Promise<Book[]>
  @HideField()
  @Column({ type: 'jsonb', nullable: true })
  roles: AccessRole[];

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date

  constructor(data: DeepPartial<ProductGroup>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}

@ObjectType()
export class ProductGroupConnection extends PaginationBase(ProductGroup) {}

@Entity({
  name: 'productgroup_access',
})
@Index(['productGroupsId', 'action', 'userId'], { unique: true })
export class ProductGroupAccess {
  @PrimaryColumn({ unsigned: true })
  productGroupsId: number;

  @PrimaryColumn({ length: 50 })
  action: string;

  @PrimaryColumn({ unsigned: true })
  userId: number;

  constructor(data: Partial<ProductGroupAccess>) {
    Object.assign(this, data);
  }
}
