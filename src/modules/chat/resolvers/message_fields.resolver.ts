import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersService } from 'src/modules/users/services/users.service';
import { Message, MessageMediaDetail, MessageRedis } from '../entities/message.entity';
import { MessageService } from '../services/message.service';
import { MessageTypeEnum } from 'src/graphql/enums/message_type';
import { MediaEntity } from 'src/modules/media/entities/media.entity';
import { ProductEntity, ProductInfoChat } from 'src/modules/products/entities/products.entity';
import { ProductsService } from 'src/modules/productS/services/products.service';
import { CurrentUser } from 'src/decorators/common.decorator';
import { ADMIN_ID_CHAT } from 'src/helpers/constants';
import { MessageNotice } from '../entities/message_notice.entity';

@Resolver(() => Message)
export class MessagesFieldsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly productsService: ProductsService,
  ) { }

  @ResolveField(() => User, {
    nullable: false,
    defaultValue: {},
  })
  async user(@Parent() message: Message, @CurrentUser() user: User) {
    if (message.userId === ADMIN_ID_CHAT) {
      return user;
    }
    // return this.usersService.findByUserId(message.userId);
    return null;
  }

  @ResolveField(() => Message, {
    nullable: false,
    defaultValue: {},
  })
  async parent(@Parent() message: Message) {
    return this.messageService.getMessageParent(message.parentId);
  }

  @ResolveField(() => MediaEntity, {
    nullable: true,
    defaultValue: {},
  })
  async media(@Parent() message: Message) {
    if (message.messageType === MessageTypeEnum.IMAGE) {
      return this.messageService.getMediaMessage(message.mediaId);
    }
  }

  @ResolveField(() => ProductInfoChat, {
    nullable: true,
    defaultValue: {},
  })
  async product(@Parent() message: Message) {
    if (message.messageType === MessageTypeEnum.PRODUCT) {
      // return this.productsService.findProductById(message.productId);
      return null;
    }
  }

  @ResolveField(() => MessageNotice, {
    nullable: true,
    defaultValue: {},
    name: 'notice',
  })
  async notice(@Parent() message: Message) {
    if (message.messageType === MessageTypeEnum.CUSTOM) {
      return this.messageService.getNoticeDetail(message.id);
    }
  }
}

@Resolver(() => MessageRedis)
export class MessagesRedisFieldsResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly messageService: MessageService,
    private readonly productsService: ProductsService,
  ) { }

  @ResolveField(() => User, {
    nullable: false,
    defaultValue: {},
  })
  async user(@Parent() message: Message, @CurrentUser() user: User) {
    if (message.userId === ADMIN_ID_CHAT) {
      return user;
    }
    // return this.usersService.findByUserId(message.userId);
    return null;
  }

  @ResolveField(() => Message, {
    nullable: false,
    defaultValue: {},
  })
  async parent(@Parent() message: Message) {
    return this.messageService.getMessageParent(message.parentId);
  }

  @ResolveField(() => MediaEntity, {
    nullable: true,
    defaultValue: {},
  })
  async media(@Parent() message: Message) {
    if (message.messageType === MessageTypeEnum.IMAGE) {
      return this.messageService.getMediaMessage(message.mediaId);
    }
  }

  @ResolveField(() => ProductInfoChat, {
    nullable: true,
    defaultValue: {},
  })
  async product(@Parent() message: Message) {
    if (message.messageType === MessageTypeEnum.PRODUCT) {
      // return this.productsService.findProductById(message.productId);
    }
    return null;
  }

  @ResolveField(() => MessageNotice, {
    nullable: true,
    defaultValue: {},
    name: 'notice',
  })
  async notice(@Parent() message: Message) {
    if (message.messageType === MessageTypeEnum.CUSTOM) {
      return this.messageService.getNoticeDetail(message.id);
    }
  }
}
