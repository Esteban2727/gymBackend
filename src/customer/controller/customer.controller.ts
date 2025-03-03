import {  Controller, Get, Param, Post, UseGuards,Req } from "@nestjs/common";
import { AuthGuard } from "src/guards/JwtAutentication.guard";
import { CustomerService } from "../services/customer.service";
import { SessionUser } from "src/decorator/session-user.decorator";
import { Roles } from "src/decorator/roles.decorator";
import { rolEnum } from "src/enum/rol.enum";
import { RolesGuard } from "src/guards/roles.guard";

@Controller('customer')
export class CustomerController{
constructor(private readonly CustomerService:CustomerService){}


@Get(":id")

@UseGuards(AuthGuard,RolesGuard)
@Roles(rolEnum.cliente)
async GetCustomer(
@Param("id") id: string  
){
 const searchCustomer = await this.CustomerService.GetCustomerById(JSON.stringify(id))
 return searchCustomer
}

@Get()
@UseGuards(AuthGuard)
async GetDatasProfile(
    @SessionUser() user: any ){
       return user
}
}