import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { User } from 'src/modules/users/entities/users.entity';

@Entity({
  name: 'auth_tokens',
})
export class AuthTokenEntity {
  @Column('bigint', {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column('bigint', { name: 'user_id' })
  userId: string;

  @Column({ name: 'device_id', nullable: true })
  deviceId?: string;

  @Column({ name: 'access_token' })
  accessToken: string;

  @Column({ name: 'refresh_token' })
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;

  @ManyToOne(() => User, (users) => users.id, { primary: true })
  @JoinColumn({ name: 'user_id' })
  users: Promise<User>;
}
