import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entity/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  
  async getUserById(id: string) {
    return await this.userRepository.findOne({ where: { identification:id } });
  }

 
  async updateProfilePicture(userId: string, imageUrl: string) {
    const user = await this.userRepository.findOne({ where: { identification: userId } });
    if (!user) {
      throw new Error(' Usuario no encontrado');
    }
    user.profilePicture = imageUrl;
    await this.userRepository.save(user);
    return user;
  }
}
