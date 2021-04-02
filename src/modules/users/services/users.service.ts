import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { UserRepository } from '../repositories/users.repository';
import { User } from '../entities/users.entity';
import bcrypt from 'bcryptjs';
import { MailerService } from '@nestjs-modules/mailer';
import { RoleEnum } from 'src/graphql/enums/roles';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository, private readonly mailerService: MailerService) { }

  create = (data: DeepPartial<User>) => {
    const salt = bcrypt.genSaltSync(10);
    data.roles = [RoleEnum.ADMIN];
    data.password = bcrypt.hashSync(data.password ?? '', salt);
    data.passwordSalt = salt;
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  };

  findById = async (id: string) => {
    return this.userRepository.findOne({ where: { id } });
  };

  findOne = async (username: string): Promise<User | undefined> => {
    return this.userRepository.findOneOrFail({ where: { username } });
  };

  // pagination = () => {
  //   return this.userRepository.paginate({ page: 1, limit: 15 });
  // };

  async userChangePass({ newpassword, username, temppass }: { newpassword: string; username: string; temppass: string }) {
    // check exist record in db
    // changer pass for user
    const user = await this.userRepository.findOne({ username });
    if (user) {
      const salt = bcrypt.genSaltSync(10);
      const password = bcrypt.hashSync(newpassword ?? '', salt);
      const passwordSalt = salt;
      await this.userRepository.update(user.id, { password: password, passwordSalt: passwordSalt });
      const dataMail = {
        username: username,
        code: `123`,
      };

      this.sendMail(dataMail.username, dataMail.code);
      return this.userRepository.findOneOrFail(user.id);
      // console.log(user);
    } else {
      return null;
    }
  }

  async pagination({ limit, page }: { limit?: number; page?: number }) {
    return this.userRepository.paginate(
      {
        limit,
        page,
      },
      {
        order: {
          id: 'DESC',
        },
      },
    );
  }

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

  sendMail = (a: string, b: string) => {
    console.log(a);
    // this.mailerService
    //   .sendMail({
    //     to: 'thedv91@gmail.com',
    //     from: 'noreply@harry.com',
    //     subject: 'Testing Nest Mailermodule with template ✔',
    //     template: 'demo',
    //     context: {
    //       // Data to be sent to template engine.
    //       code: 'cf1a3f828287',
    //       username: 'Harry Duong',
    //     },
    //   })
    //   .then((success) => {
    //     console.log(success);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };
}
