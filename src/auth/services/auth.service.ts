import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { hash } from 'crypto';
import { HashearPassword } from '../bycript/bycript';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async comparePasswords(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateToken(user: any): Promise<string> {
    const token = this.jwtService.sign({
      id: user.id,
      username: user.username,
    });
    console.log(token);
    return token;
  }

  async register(
    email: string,
    cellphone: string,
    password: string,
    username: string,
  ) {
    const hashedPassword = await HashearPassword(password);
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      cellphone,
      username,
    });
    await this.userRepository.save(user);
    return user;
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user || !(await this.comparePasswords(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(user);
  }
}
