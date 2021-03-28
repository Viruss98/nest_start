import { Entity, Column, DeepPartial, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { ObjectType, Field, Int, HideField, ID } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';

export enum AppRoles {
  BASE = 'BASE',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
  USER = 'USER',
  USER_CREATE_ANY_VIDEO = 'USER_CREATE_ANY_VIDEO',
  USER_CREATE_ANY_BLOG = 'USER_CREATE_ANY_BLOG',
  ADMIN_UPDATE_OWN_VIDEO = 'ADMIN_UPDATE_OWN_VIDEO',
}

@ObjectType({
  implements: [Node],
})
@Entity({
  name: 'users',
})
export class User implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ length: 50, unique: true, name:'user_name' })
  username: string;

  @HideField()
  @Column()
  password: string;

  @HideField()
  @Column({name:'password_salt'})
  passwordSalt: string;

  @Field({
    nullable: true,
    name:''
  })
  @Column({ nullable: true, name:'first_name' })
  firstName: string;

  @Column({ nullable: true, name:'last_name' })
  lastName?: string;

  @Field(() => Int)
  @Column('int', { nullable: true })
  age?: number;

  @Column({
    default: false, name:'is_active',
  })
  isActive: boolean;

  @Column({
    nullable: true,
    type: 'text',
    enum: AppRoles,
    array: true,
  })
  roles?: string[];

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date

  constructor(partial: DeepPartial<User>) {
    Object.assign(this, { id: snowflake.nextId(), ...partial });
  }
}

@ObjectType()
export class UserConnection extends PaginationBase(User) {}
