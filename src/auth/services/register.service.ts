import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/subcription/Entity/subcription.entity';

export class RegisterService {
  constructor(
    @InjectRepository(User) readonly UserRepository: Repository<User>,
    @InjectRepository(Subscription) readonly SubscriptionRepository: Repository<Subscription>,
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
        where: [{ username: username},{ email: email },{identification:identification}],
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

      const addSubcriptionUser=await this.SubscriptionRepository.create({
        startDate: new Date ,
        user:identification
      })

      await this.SubscriptionRepository.save(addSubcriptionUser)
      return user;
    } catch (e) {
      throw new Error('error al procesar datos');
    }
  }
}
