import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { FileTypeEnum } from 'src/graphql/enums/file_type';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { BaseEntity, Column, CreateDateColumn, DeepPartial, DeleteDateColumn, Entity, UpdateDateColumn } from 'typeorm';

@ObjectType('Media', {
  implements: [Node],
})
@Entity({
  name: 'medias',
})
// @Tree('closure-table')
export class MediaEntity extends BaseEntity implements Node {
  @Field(() => ID)
  // @PrimaryGeneratedColumn()
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column({ length: 500, nullable: true, name:'file_path' })
  filePath?: string;

  @Column({ length: 100, nullable: true, name:'mime_type' })
  mimeType?: string;

  @Field(() => Int)
  @Column({ type: 'int4', unsigned: true, nullable: true, name:'file_size' })
  fileSize?: number;

  @Column({
    type: 'bigint',
    nullable: true,
    unsigned: true,
    name:'owner_id'
  })
  ownerId?: string;

  @Column({
    type: 'enum',
    default: FileTypeEnum.FILE,
    enum: FileTypeEnum,
  })
  type: FileTypeEnum;

  @CreateDateColumn({name:'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name:'updated_at'})
  updatedAt: Date;

  @DeleteDateColumn({name:'deleted_at', nullable:true})
  deletedAt?: Date

  // @HideField()
  // @TreeChildren({ cascade: true })
  // children: MediaEntity[];

  // @HideField()
  // @TreeParent()
  // parent?: MediaEntity;

  constructor(data: DeepPartial<MediaEntity>) {
    super();
    Object.assign(this, { id: snowflake.nextId(), ...data });
  }
}

@ObjectType('MediaConnection')
export class MediaConnection extends PaginationBase(MediaEntity) {}
