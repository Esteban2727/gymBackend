import { Body, Controller, Post } from "@nestjs/common";
import { loginServices } from "../services/login.service";
import { LoginDto } from "../DTO/login.dto";

@Controller('login')
export class loginController{
constructor(
    private readonly loginServices:loginServices
){}
@Post()
async compareEmail(
@Body()loginDto:LoginDto
){
const {email,password}=loginDto
const sendDatasVerify=await this.loginServices.sign_In(email,password)
return sendDatasVerify
}
}