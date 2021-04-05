import { Field, ID, ObjectType } from '@nestjs/graphql';
import { MessageTypeEnum, TypingTypeEnum } from 'src/graphql/enums/message_type';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { Column, CreateDateColumn, DeepPartial, Entity, UpdateDateColumn } from 'typeorm';

@ObjectType({
  implements: [Node],
})
@Entity({
  name: 'message',
})
export class Message implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column('bigint', { nullable: false, name: 'room_id' })
  roomId: string;

  @Column('bigint', { nullable: false, name: 'user_id' })
  @Field({ nullable: false })
  userId: string;

  @Column({ nullable: true, name: 'parent_id' })
  @Field({ nullable: true })
  parentId: string;

  @Column('bigint', { nullable: true, name: 'media_id' })
  @Field({ nullable: true })
  mediaId: string;

  @Column('bigint', { nullable: true, name: 'product_id' })
  @Field({ nullable: true })
  productId: string;

  @Column({ nullable: false, default: MessageTypeEnum.TEXT, name: 'message_type', enum: MessageTypeEnum })
  messageType: MessageTypeEnum;

  @Column({ nullable: true, type: 'text' })
  @Field({ nullable: true })
  content?: string;

  @Column({ nullable: true, type: 'json' })
  @Field({ nullable: true })
  data?: string;

  @Column({ name: 'is_delete', default: false, type: 'boolean' })
  isDelete: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  constructor(partial: DeepPartial<Message>) {
    Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
  }
}

@ObjectType({
  implements: [Node],
})
export class MessageRedis implements Node {
  @Field(() => ID)
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;
  roomId: string;

  @Field({ nullable: false })
  userId: string;

  @Field({ nullable: true })
  parentId: string;

  @Field({ nullable: true })
  mediaId: string;

  @Field({ nullable: true })
  productId: string;

  @Column({ nullable: false, default: MessageTypeEnum.TEXT, name: 'message_type', enum: MessageTypeEnum })
  messageType: MessageTypeEnum;

  @Field({ nullable: true })
  content?: string;

  @Field({ nullable: true })
  data?: string;

  isDelete: boolean;

  createdAt: string;

  updatedAt: string;
}

@ObjectType()
export class MessageConnection extends PaginationBase(Message) { }

@ObjectType()
export class TypingConnection {
  type: TypingTypeEnum;
  userId: string;
  roomId: string;
}

@ObjectType({
  implements: [Node],
})
export class MessageMediaDetail implements Node {
  @Field(() => ID)
  id: string;
  mediaId: string;
  imageName: string;
  filePath: string;
  messageType: MessageTypeEnum;
}
