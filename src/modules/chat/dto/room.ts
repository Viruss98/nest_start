import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GetRoomInput {
    @Field({ nullable: true })
    page?: number;
    @Field({ nullable: true })
    limit?: number;
    @Field({ nullable: true })
    keyword: string;
}
