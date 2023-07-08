import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from "@nestjs/common"
import { AuthDto } from "./dto/auth.dto"
import { PrismaService } from "../prisma.service"
import { faker } from "@faker-js/faker"
import { hash, verify } from "argon2"
import { JwtService } from "@nestjs/jwt"
import { User } from "@prisma/client"
import { RefreshTokenDto } from "./dto/refresh-token.dto"
import { UserService } from "../user/user.service"

@Injectable()
export class AuthService {
	constructor(
		private prisma: PrismaService,
		private jwtService: JwtService,
		private userService: UserService,
	) {}


	async login(dto: AuthDto) {
		const user = await this.validateUser(dto)
		const tokens = await this.issueToken(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	async getNewTokens(dto: RefreshTokenDto) {
		const result = await this.jwtService.verifyAsync(dto.refreshToken)

		if (!result) {
			throw new UnauthorizedException("Invalid refresh token")
		}

		const user = await this.userService.byId(result.id)

		const tokens = await this.issueToken(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}


	async register(dto: AuthDto) {
		const oldUser = await this.userService.byEmail(dto.email)

		if (oldUser) {
			throw new BadRequestException("User already exists")
		}

		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: faker.person.firstName(),
				avatarPath: faker.image.avatar(),
				phone: faker.phone.number("+7 (###) ###-##-##"),
				password: await hash(dto.password),
			},
		})


		const tokens = await this.issueToken(user.id)

		return {
			user: this.returnUserFields(user),
			...tokens,
		}
	}

	private async issueToken(userId: number) {
		const data = { id: userId }

		const accessToken = this.jwtService.sign(
			data, {
				expiresIn: "1h",
			},
		)

		const refreshToken = this.jwtService.sign(
			data, {
				expiresIn: "7d",
			},
		)

		return {
			accessToken,
			refreshToken,
		}
	}

	private returnUserFields(user: User) {
		return {
			id: user.id,
			email: user.email,
		}
	}


	private async validateUser(dto: AuthDto) {
		const user = await this.userService.byEmail(dto.email)

		if (!user) {
			throw new NotFoundException("User not found")
		}

		const isValid = await verify(user.password, dto.password)


		if (!isValid) {
			throw new UnauthorizedException("Invalid password")
		}

		return user
	}
}
