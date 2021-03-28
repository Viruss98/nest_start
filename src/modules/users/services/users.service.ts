import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { UserRepository } from '../repositories/users.repository';
import { User } from '../entities/users.entity';
import bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private readonly mailerService: MailerService) {}

  create = (data: DeepPartial<User>) => {
    const salt = bcrypt.genSaltSync(10);
    data.roles = ['BASE', 'ADMIN'];
    data.password = bcrypt.hashSync(data.password ?? '', salt);
    data.passwordSalt = salt;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  };

  findOne = async (username: string): Promise<User | undefined> => {
    return this.userRepository.findOneOrFail({ where: { username } });
  };

  pagination = () => {
    return this.userRepository.paginate({ page: 1, limit: 15 });
  };

  login = async (username: string, password: string) => {
    const user = await this.userRepository.findOneOrFail({
      where: { username },
    });
    const check = bcrypt.compareSync(password, user.password);
    if (check) {
      return user;
    } else {
      return false;
    }
  };

  public sendMail(): void {
    this.mailerService
      .sendMail({
        to: 'thedv91@gmail.com',
        from: 'noreply@harry.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'demo',
        context: {
          // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'Harry Duong',
        },
      })
      .then((success) => {
        console.log(success);
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
