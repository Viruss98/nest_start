import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BlogEntity } from './modules/blogs/entities/blog.entity';
import { ProductEntity } from './modules/products/entities/products.entity';
import { User } from './modules/users/entities/users.entity';
import { ProductGroup, ProductGroupAccess } from './modules/productgroup/entities/productgroup.entity';
import { Category, CategoryAccess } from './modules/category/entities/category.entity';
import { AuthTokenEntity } from './modules/auth/entities/auth.entity';
// import { MediaEntity } from './modules/media/entities/media.entity';
import { ProductCate, ProductCateAccess } from './modules/productcate/entities/productcate.entity';
import { Room } from './modules/chat/entities/room.entity';
import { RoomMember } from './modules/chat/entities/room_member.entity';
import { Message } from './modules/chat/entities/message.entity';
import { MessageNotice } from './modules/chat/entities/message_notice.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: parseInt(process.env.DATABASE_PORT || '5432', 10),
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNC === 'true',
  entities: [
    BlogEntity,
    User,
    Category,
    CategoryAccess,
    // MediaEntity,
    AuthTokenEntity,
    ProductGroup,
    ProductGroupAccess,
    ProductEntity,
    ProductCate,
    ProductCateAccess,
    Room,
    RoomMember,
    Message,
    MessageNotice,
  ],
  logging: process.env.DATABASE_LOGGING === 'true',
};
