import { Body, Controller, Post } from "@nestjs/common";
import { GymDto } from "../DTO/gym.dto";
import { gymServices } from "../services/gym.service";
import { ApiOperation, ApiTags, ApiResponse } from "@nestjs/swagger";

@Controller("gym")
@ApiTags("Gym") 
export class GymController {
    constructor(private readonly gymServices: gymServices) {}

    @Post()
    @ApiOperation({ summary: "Create a new gym", description: "Saves a new gym with the provided details." })
    @ApiResponse({ status: 201, description: "Gym created successfully", schema: {
        example: { message: "Gym created successfully" }
    }})
    @ApiResponse({ status: 400, description: "Invalid gym data" })
    async SaveGYM(@Body() gymDto: GymDto) {
        const { font, logoUrl, name, primaryColor, secondaryColor } = gymDto;
        const VerifyGym = await this.gymServices.verifyDatasGym(font, logoUrl, name, primaryColor, secondaryColor);
        if (!VerifyGym) {
            return { message: "Gym created successfully" };
        }
        return VerifyGym;
    }
}
