import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entity/user.entity';
import { MailService } from 'src/mail/mail.service';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginDto } from '../DTO/login.dto';
@Injectable()
export class RecoverPasswordServices {
  constructor(
    @InjectRepository(User)
    readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {}

  async forgotPassword(email: string) {
    console.log(email);
    const user = await this.userRepository.findOne({
      where: { email: email },
    });
    if (!user) {
      throw new NotFoundException('El usuario no existe');
    }

    console.log('recorrido');

    const token = this.jwtService.sign(
      { userId: user.identification },
      { secret: 'hola', expiresIn: '1h' },
    );

   const save= await this.mailService.sendPasswordReset(user.email, token);

    return save;
  }

   async resetPassword(token: string, password: string) {
    console.log(password)
    let payload;
    try {
      payload = this.jwtService.verify(token);
    } catch (error) {
      throw new BadRequestException('Token inválido o expirado');
    }

    const user = await this.userRepository.findOne({
      where: { identification: payload.userId },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);

    return { message: 'Contraseña restablecida exitosamente' };
  } 
}
