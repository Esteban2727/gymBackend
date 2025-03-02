import { Injectable, BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entity/user.entity";
import { comparePasswords } from "../bycript/bycript";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class loginServices {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async sign_In(email: string, password: string) {
    // Buscar usuario por email
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException("User not found");
    }

    // Comparar contraseñas
    const isPasswordValid = await comparePasswords(password, user.password);
    
    if (!isPasswordValid) {
      throw new BadRequestException("Incorrect password");
    }

    return user;
  }

  async generateToken(user: User): Promise<{ access_token: string; refresh_token: string }> {
    const payload = { id: user.identification, email: user.email, rol: user.rol };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' })
    };
  }
}
