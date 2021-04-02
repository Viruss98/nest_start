import { Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/modules/users/users.module';
import { MessageRepository } from './repositories/message.repository';
import { RoomRepository } from './repositories/room.repository';
import { RoomMemberRepository } from './repositories/room_member.repository';
import { MessageResolver } from './resolvers/message.resolver';
import { RoomsMutationResolver } from './resolvers/room_mutations.resolver';
import { RoomsQueriesResolver } from './resolvers/room_queries.resolver';
import { MessageService } from './services/message.service';
import { RoomService } from './services/room.service';
import { RoomMembersFieldsResolver } from './resolvers/room_member_fields.resolver';
import { RoomsFieldsResolver, RoomRedisFieldsResolver } from './resolvers/room_fields.resolver';
import { MessagesFieldsResolver, MessagesRedisFieldsResolver } from './resolvers/message_fields.resolver';
// import { MessageSeenRepository } from './repositories/message_seen.repository';
import { RoomDataLoader } from './dataloaders/room.dataloader';
import { MediaModule } from '../media/media.module';
// import { MessageBlocksRepository } from './repositories/message_block.repository';
// import { MessageSettingsRepository } from './repositories/message_setting.repository';
import { ProductsModule } from '../products/products.module';
import Redis from 'ioredis';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { MessageNoticesRepository } from './repositories/message_notice.repository';
// import { MessageBlocksFieldsResolver } from './resolvers/message_blocks_fields.resolver';
import { NotificationModule } from 'src/modules/notification/notification.module';
@Module({
  imports: [
    UsersModule,
    MediaModule,
    ProductsModule,
    TypeOrmModule.forFeature([RoomRepository, RoomMemberRepository, MessageRepository, MessageNoticesRepository]),
    NotificationModule,
  ],
  providers: [
    RoomService,
    RoomsMutationResolver,
    RoomsQueriesResolver,
    MessageResolver,
    MessageService,
    RoomsFieldsResolver,
    RoomMembersFieldsResolver,
    MessagesFieldsResolver,
    MessagesRedisFieldsResolver,
    RoomRedisFieldsResolver,
    RoomDataLoader,
    {
      provide: 'PUB_SUB',
      // useValue: new PubSub(),
      useFactory: () => {
        const options = {
          // host: 'localhost',
          host: '10.0.64.117',
          port: 6379,
        };

        return new RedisPubSub({
          publisher: new Redis(options),
          subscriber: new Redis(options),
        });
      },
    },
  ],
})
export class ChatModule {}
