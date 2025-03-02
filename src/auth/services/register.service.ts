import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';

export class RegisterService {
  constructor(
    @InjectRepository(User) readonly UserRepository: Repository<User>,
  ) {}
  async register(
    identification,
    username: string,
    email: string,
    password: string,
    number: string,
    rol: string,
  ) {
    try {
      const verifyDatasServices = await this.UserRepository.findOne({
        where: [{ username: username, email: email }],
      });
      if (verifyDatasServices) {
        return 'esos datos ya estan registrados';
      }
      const HashPassword:string= await  bcrypt.hash(password, await bcrypt.genSalt());
      const user = await this.UserRepository.create({
        identification:identification,
        username: username,
        email: email,
        password: HashPassword,
        cellphone: number,
        rol: rol,

      });
      await this.UserRepository.save(user);
      return user;
    } catch (e) {
      throw new Error('error al procesar datos');
    }
  }
}
