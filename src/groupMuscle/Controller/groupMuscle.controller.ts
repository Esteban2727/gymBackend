import { Body, Controller, Get, Post } from '@nestjs/common';
import { GroupMuscleServices } from '../services/gropuMuscle.Service';
import { GroupMuscularDTO } from '../GroupMuscularDTO';

@Controller('group')
export class GroupuMuscleController {
  constructor(private readonly gropuMuscleServices: GroupMuscleServices) {}

  @Get()
  async getGroupMuscle() {
    const getDataMuscle = await this.gropuMuscleServices.getDatasMuscle();
    return getDataMuscle;
  }

  @Post()
  async createGroupMuscle(@Body() name: string) {
    const createGroupMuscle =
      await this.gropuMuscleServices.createGroupMuscle(name);
    console.log(createGroupMuscle);
    return 'create succefully';
  }


  @Post('create')
  async createGroup(@Body() nameDTO: GroupMuscularDTO) {
    const { name } = nameDTO;
    console.log(name);
    const p = await this.gropuMuscleServices.createGroup(name);
    console.log(p);
    return p;
  }
}
