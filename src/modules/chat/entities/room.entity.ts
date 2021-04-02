import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoomTypeEnum } from 'src/graphql/enums/room_type';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { Column, CreateDateColumn, DeepPartial, Entity, UpdateDateColumn } from 'typeorm';

@ObjectType({
  implements: [Node],
})
@Entity({
  name: 'rooms',
})
export class Room implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ nullable: true, name: 'room_name' })
  @Field({ nullable: true })
  roomName: string;

  @Column({ nullable: true, name: 'room_type', enum: RoomTypeEnum, type: 'text' })
  @Field({ nullable: true })
  roomType: RoomTypeEnum;

  @Column('bigint', { nullable: false, name: 'create_by' })
  @Field({ nullable: false })
  createBy: string;

  @Column('bigint', { nullable: true, name: 'create_for' })
  @Field({ nullable: true })
  createFor?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  image?: string;

  @Column({ name: 'is_delete', default: false, type: 'boolean' })
  @Field({ nullable: true })
  isDelete: boolean;

  @Column('timestamp', { name: 'last_update', default: new Date() })
  @Field({ nullable: true })
  lastUpdated: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<Room>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
 }
}
@ObjectType({
  implements: [Node],
})
export class RoomRedis implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  roomName?: string;

  roomType: RoomTypeEnum;

  createBy: string;

  createFor?: string;

  image?: string;

  isDelete: boolean;
  lastUpdated: string;

  createdAt: string;

  updatedAt: string;

  constructor(partial: DeepPartial<Room>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}

@ObjectType()
export class RoomConnection extends PaginationBase(Room) {}
