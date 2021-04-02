import { MessageTypeEnum, TypingTypeEnum } from 'src/graphql/enums/message_type';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetMessagesInput {
    @Field({ nullable: true })
    page?: number;
    @Field({ nullable: true })
    limit?: number;
    @Field({ nullable: false })
    roomId: string;
}

@InputType()
export class GetMessageBlocksInput {
    @Field({ nullable: true })
    page?: number;
    @Field({ nullable: true })
    limit?: number;
}

@InputType()
export class GetNoticesInput {
    @Field({ nullable: true })
    page?: number;
    @Field({ nullable: true })
    limit?: number;
}

@InputType()
export class SeenMessagesInput {
    @Field({ nullable: false })
    roomId: string;
}

@InputType()
export class NewNoticeMessagesInput {
    @Field({ nullable: true })
    content?: string;

    @Field({ nullable: true })
    title?: string;

    @Field({ nullable: false })
    image: string;

    @Field({ nullable: true })
    link?: string;

    @Field({ nullable: true })
    buttonName?: string;
}

@InputType()
export class NewMessagesInput {
    @Field({ nullable: true })
    content?: string;

    @Field({ nullable: true })
    parentId?: string;

    @Field({ nullable: false })
    roomId: string;

    @Field({ nullable: true })
    mediaId?: string;

    @Field({ nullable: true })
    productId?: string;

    @Field({ nullable: false, defaultValue: MessageTypeEnum.TEXT })
    type?: MessageTypeEnum;
}

@InputType()
export class TypingMessagesInput {
    @Field({ nullable: false })
    type: TypingTypeEnum;

    @Field({ nullable: false })
    roomId: string;
}
