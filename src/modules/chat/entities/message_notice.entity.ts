import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { Column, CreateDateColumn, DeepPartial, Entity, UpdateDateColumn } from 'typeorm';

@ObjectType({
    implements: [Node],
})
@Entity({
    name: 'message_notice',
})
export class MessageNotice implements Node {
    @Field(() => ID)
    @Column('bigint', {
        primary: true,
        unsigned: true,
    })
    id: string;

    @Column('bigint', { nullable: false, name: 'message_id' })
    @Field({ nullable: false })
    messageId: string;

    @Column({ nullable: true, name: 'content' })
    @Field({ nullable: true })
    content: string;

    @Column({ nullable: true, name: 'title' })
    @Field({ nullable: true })
    title: string;

    @Column({ nullable: true, name: 'image' })
    @Field({ nullable: true })
    image: string;

    @Column({ nullable: true, name: 'link' })
    @Field({ nullable: true })
    link: string;

    @Column({ nullable: true, name: 'button_name' })
    @Field({ nullable: true })
    buttonName: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    constructor(partial: DeepPartial<MessageNotice>) {
        Object.assign(this, { id: snowflake.nextId().toString(), ...partial });
    }
}
@ObjectType()
export class MessageNoticeConnection extends PaginationBase(MessageNotice) {}
