import { 
    Controller, 
    Get, 
    Param, 
    Post, 
    UseGuards, 
    Req 
  } from "@nestjs/common";
  import { AuthGuard } from "src/guards/JwtAutentication.guard";
  import { CustomerService } from "../services/customer.service";
  import { SessionUser } from "src/decorator/session-user.decorator";
  import { Roles } from "src/decorator/roles.decorator";
  import { rolEnum } from "src/enum/rol.enum";
  import { RolesGuard } from "src/guards/roles.guard";
  import { registerDTO } from "src/auth/DTO/register.dto";
  import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";
  
  @Controller('customer')
  @ApiTags('Customer') 
  export class CustomerController {
    constructor(private readonly CustomerService: CustomerService) {}
  
    @Get(":id")
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(rolEnum.cliente)
    @ApiOperation({ summary: 'Get customer by ID', description: 'Retrieve customer details by their identification number.' })
    @ApiResponse({ status: 200, description: 'Customer found', schema: {
      example: {
        id: "123456",
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "123-456-7890"
      }
    }})
    @ApiResponse({ status: 404, description: 'Customer not found' })
    async GetCustomer(@Param("id") id: registerDTO) {
      const { identification } = id;
      const searchCustomer = await this.CustomerService.GetCustomerById(identification);
      return searchCustomer;
    }
  
    @Get()
    @UseGuards(AuthGuard)
    @ApiOperation({ summary: 'Get user session data', description: 'Retrieve session data of the authenticated user.' })
    @ApiResponse({ status: 200, description: 'User session data', schema: {
      example: {
        id: "123456",
        name: "John Doe",
        role: "cliente"
      }
    }})
    async GetDatasProfile(@SessionUser() user: any) {
      return user;
    }
  }
  