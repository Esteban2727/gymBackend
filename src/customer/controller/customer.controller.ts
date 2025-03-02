import {  Controller, Get, Param, Post, UseGuards,Req } from "@nestjs/common";
import { AuthGuard } from "src/guards/JwtAutentication.guard";
import { CustomerService } from "../services/customer.service";
import { SessionUser } from "src/decorator/session-user.decorator";

@Controller('customer')
export class CustomerController{
constructor(private readonly CustomerService:CustomerService){}


@Get(":id")
@UseGuards(AuthGuard)
async GetCustomer(
@Param()id:string    
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