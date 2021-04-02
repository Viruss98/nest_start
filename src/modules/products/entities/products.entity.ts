import { Entity, Column, BaseEntity, DeepPartial, DeleteDateColumn, ManyToMany, JoinTable, RelationId } from 'typeorm';
import { CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Node } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
// import { ProductGroup } from "../../productgroup/entities/productgroup.entity";
import { ProductCate } from '../../productcate/entities/productcate.entity';

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
    name: 'is_published',
  })
  isPublished: boolean;

  @ManyToMany(type => ProductCate, productcate => productcate.products, {
      cascade: true
  })
  @JoinTable()
  // @Field(() => [ProductCate], {nullable: true, defaultValue: []})
  productcates: ProductCate[];
  // @RelationId((product: ProductEntity) => product.productGroups)
  // @Field(() => [ID], {nullable: true, defaultValue: []})
  // productGroupIds: string[];
  // // @ManyToMany(() => ProductGroup, category => category.products, {
  // //   cascade: true
  // // })
  // @ManyToMany(() => ProductGroup, productgroup => productgroup.products, {cascade: true})
  // @JoinTable({
  //   name: "products_groups_relation",
  //   joinColumn: {
  //     name: "productsId",
  //     referencedColumnName: "id"
  //   },
  //   inverseJoinColumn: {
  //     name: "productGroupsId",
  //     referencedColumnName: "id"
  //   }
  // })
  // // @Field(() => [ProductGroup], {nullable: true, defaultValue: []})
  // // productGroups: ProductGroup[];
  //
  // @Field(() => [ProductGroup], {nullable: true, defaultValue: []})
  // productGroups: Promise<ProductGroup[]>;

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date


  constructor(data?: DeepPartial<ProductEntity>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}

@ObjectType()
export class ProductInfoChat {
  @Field(() => ID)
  id: string;
}
