import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { returnUserObject } from "./objects/return-user.object"
import { Prisma } from "@prisma/client"
import { UserDto } from "./dto/user.dto"
import { hash } from "argon2"

@Injectable()
export class UserService {
	constructor(private prisma: PrismaService) {
	}

	async byParam(param: keyof Prisma.UserWhereUniqueInput, value: any, selectObject?: Prisma.UserSelect) {
		console.log({param, value})
		const user = await this.prisma.user.findUnique({
			where: { [param]: value },
			select: {
				...returnUserObject,
				favorites: {
					select: {
						id: true,
						name: true,
						price: true,
						images: true,
						slug: true,
					},
				},
				...selectObject,
			},
		})

		if (!user) {
			throw new NotFoundException("User not found")
		}

		return user
	}


	async updateProfile({id, dto}:{id: number, dto: UserDto}) {
		const user = await this.byParam('id', id)

		if (user && id !== user.id) {
			throw new BadRequestException("Email already in use")
		}


		return this.prisma.user.update({
			where: { id },
			data: {
				email: dto.email,
				name: dto.name,
				phone: dto.phone,
				avatarPath: dto.avatarPath,
				password: dto.password ? await hash(dto.password) : user.password,
			},
		})
	}

	async toggleFavorite({userId, productId}:{userId: number, productId: number}) {
		const user = await this.byParam('id', userId)

		if (!user) {
			throw new NotFoundException("User not found")
		}

		const isExistProduct = user.favorites.some(product => product.id === productId)

		await this.prisma.user.update({
			where: { id: userId },
			data: {
				favorites: {
					[isExistProduct ? "disconnect" : "connect"]:
						{
							id: productId,
						},
				},
			},
		})

		return {
			message: 'success'
		}

	}

}
