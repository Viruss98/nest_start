import { registerEnumType } from '@nestjs/graphql';

export enum MessageTypeEnum {
    VIDEO = 'VIDEO',
    SYSTEM = 'SYSTEM',
    PRODUCT = 'PRODUCT',
    TEXT = 'TEXT',
    IMAGE = 'IMAGE',
    FILE = 'FILE',
    LOCATION = 'LOCATION',
    CUSTOM = 'CUSTOM',
}

registerEnumType(MessageTypeEnum, {
    name: 'MessageTypeEnum',
});

export enum TypingTypeEnum {
    START = 'START',
    END = 'END',
}

registerEnumType(TypingTypeEnum, {
    name: 'TypingTypeEnum',
});
