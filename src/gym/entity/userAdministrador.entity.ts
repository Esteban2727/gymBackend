import { ChildEntity, Column, OneToMany } from 'typeorm';
import { User } from '../../auth/entity/user.entity';


@ChildEntity()
export class administrator extends User {
  constructor() {
    super();
    this.rol = 'administrator'; 
  }


}
