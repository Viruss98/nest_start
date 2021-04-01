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

@ObjectType('ProductCate', {
  description: 'ProductCate',
  implements: [Node],
})
@Entity({
  name: 'productcates',
})
export class ProductCate extends BaseEntity implements Node {
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
    name: 'is_published',
  })
  isPublished: boolean;

  @Column({
    type: 'bigint',
    nullable: false,
    unsigned: true,
    name: 'owner_id',
  })
  ownerId: string;

  @ManyToMany(type => ProductEntity, productentity => productentity.productcates)
  products: ProductEntity[];
  // @RelationId((productGroup: ProductCate) => productGroup.products)
  // @Field(() => [ID], {nullable: true, defaultValue: []})
  // productIds: string[];
  // // @ManyToMany(() => ProductCate, category => category.products, {
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

  constructor(data: DeepPartial<ProductCate>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}

@ObjectType()
export class ProductCateConnection extends PaginationBase(ProductCate) {}

@Entity({
  name: 'productcate_access',
})
@Index(['productCatesId', 'action', 'userId'], { unique: true })
export class ProductCateAccess {
  @PrimaryColumn({ unsigned: true })
  productCatesId: number;

  @PrimaryColumn({ length: 50 })
  action: string;

  @PrimaryColumn({ unsigned: true })
  userId: number;

  constructor(data: Partial<ProductCateAccess>) {
    Object.assign(this, data);
  }
}
