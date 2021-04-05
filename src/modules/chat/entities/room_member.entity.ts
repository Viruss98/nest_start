import { Field, ID, ObjectType } from '@nestjs/graphql';
import { RoomMemberTypeEnum } from 'src/graphql/enums/room_type';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { Column, CreateDateColumn, DeepPartial, Entity, UpdateDateColumn } from 'typeorm';

@ObjectType({
  implements: [Node],
})
@Entity({
  name: 'room_members',
})
export class RoomMember implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column('bigint', { nullable: false, name: 'room_id' })
  @Field({ nullable: false })
  roomId: string;

  @Column('bigint', { nullable: false, name: 'user_id' })
  @Field({ nullable: false })
  userId: string;

  @Column({ nullable: false, name: 'is_member', default: true })
  @Field({ nullable: false })
  isMember: boolean;

  @Column({ nullable: false, name: 'is_leave', default: false })
  @Field({ nullable: false })
  isLeave: boolean;

  @Column({ nullable: false, name: 'role', enum: RoomMemberTypeEnum })
  @Field({ nullable: false })
  role: RoomMemberTypeEnum;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<RoomMember>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}

@ObjectType()
export class RoomMemberConnection extends PaginationBase(RoomMember) { }
