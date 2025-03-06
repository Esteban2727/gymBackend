import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { GymUserServices } from "../services/gymUser.service";
import { GymUserDto } from "../DTO/gymUser.dto";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";

@Controller("gymUser")
@ApiTags("Gym User") 
export class GymUserController {
    constructor(private readonly gymUserServices: GymUserServices) {}

    @Get(":id")
    @ApiOperation({ summary: "Get users associated with a gym", description: "Fetches users linked to a specific gym by ID." })
    @ApiResponse({ status: 200, description: "Users retrieved successfully", schema: {
        example: [{ id: "123", name: "John Doe", gymId: "456" }]
    }})
    @ApiResponse({ status: 404, description: "Gym not found" })
    async getUserOfGym(@Param("id") id: string) {
        console.log(id);
        const bringUserAssociateToGym = await this.gymUserServices.userAssociateToGym(id);
        return bringUserAssociateToGym;
    }

    @Post()
    @ApiOperation({ summary: "Associate a user to a gym", description: "Links a user to a gym." })
    @ApiResponse({ status: 201, description: "User associated successfully", schema: {
        example: { message: "User successfully associated with the gym" }
    }})
    @ApiResponse({ status: 400, description: "Invalid association data" })
    async AssocatetUserToGym(@Body() gymUserDto: GymUserDto) {
        const { idGym, idUser } = gymUserDto;
        const bringUserAssociateToGym = await this.gymUserServices.createAsocciateGym(idGym, idUser);
        return bringUserAssociateToGym;
    }
}
