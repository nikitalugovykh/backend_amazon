import {
	Body,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch,
	Post,
	Put,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common"
import { UserService } from "./user.service"
import { AuthDto } from "../auth/dto/auth.dto"
import { RefreshTokenDto } from "../auth/dto/refresh-token.dto"
import { Auth } from "../auth/decorators/auth.decorator"
import { CurrentUser } from "../auth/decorators/user.decorator"
import { UserDto } from "./dto/user.dto"

@Controller("users")
export class UserController {
	constructor(private readonly userService: UserService) {
	}

	@Get("profile")
	@Auth()
	async getProfile(@CurrentUser("id") id: number) {
		return this.userService.byId(id)
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Put("profile")
	async updateProfile(
		@CurrentUser("id") id: number,
		@Body() dto: UserDto) {
		return this.userService.updateProfile({id, dto})
	}

	@HttpCode(HttpStatus.OK)
	@Auth()
	@Patch("profile/favorites/:productId")
	async toggleFavorite(
		@Param("productId") productId: number,
		@CurrentUser("id") userId: number,
	) {
		return this.userService.toggleFavorite({userId: Number(userId), productId: Number(productId)})
	}


}
