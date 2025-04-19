import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { Subscription } from 'src/subcription/Entity/subcription.entity';
import { MailService } from 'src/mail/mail.service';

export class RegisterService {
  constructor(
    @InjectRepository(User) readonly UserRepository: Repository<User>,
    @InjectRepository(Subscription)
    readonly SubscriptionRepository: Repository<Subscription>,
    private readonly sendMail: MailService,
  ) {}
  async register(
    identification,
    username: string,
    email: string,
    password: string,
    number: string,
    rol: string,
    gender: string,
  ) {
    try {
      const verifyDatasServices = await this.UserRepository.findOne({
        where: [
          { username: username },
          { email: email },
          { identification: identification },
        ],
      });
      console.log('entro');
      if (verifyDatasServices) {
        return 'esos datos ya estan registrados';
      }
      const HashPassword: string = await bcrypt.hash(
        password,
        await bcrypt.genSalt(),
      );
      const user = await this.UserRepository.create({
        identification: identification,
        username: username,
        email: email,
        password: HashPassword,
        cellphone: number,
        rol: rol,
        gender: gender,
      });
      await this.UserRepository.save(user);

      const addSubcriptionUser = await this.SubscriptionRepository.create({
        startDate: new Date(),
        customer: identification,
      });

      await this.SubscriptionRepository.save(addSubcriptionUser);
      const subject = 'usuario creado, bienvenido';
      const html = `
      <div style="font-family: Arial, sans-serif; background: linear-gradient(135deg, #ff7e5f, #feb47b); padding: 20px; text-align: center; border-radius: 10px; max-width: 400px; margin: auto; color: #333;">
          <h1 style="color: #222;">Bienvenido al gimnasio ${username} 🏋️‍♂️</h1>
          <img src="https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif" alt="GIF Motivacional" style="width:100%; border-radius: 10px; margin-top: 10px;">
          <div style="border-top: 2px dashed #ddd; margin: 15px 0;"></div>
          <p style="font-size: 16px; margin: 10px 0;"><strong>Correo electrónico:</strong> ${email}</p>
          <p style="font-size: 16px; margin: 10px 0;"><strong>Contraseña:</strong> ${password}</p>
          <p style="font-size: 16px; margin: 10px 0;"><strong>Celular:</strong> ${number}</p>
          <div style="border-top: 2px dashed #ddd; margin: 15px 0;"></div>
          <p style="color: #666; font-size: 14px;">¡Gracias por unirte! Te esperamos en el gimnasio para que alcances tus metas. 💪</p>
      </div>
  `;
      await this.sendMail.sendEmail(email, html, subject);
      return user;
    } catch (e) {
      throw new Error('error al procesar datos');
    }
  }
}
