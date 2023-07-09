import { Injectable } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { UserService } from "../user/user.service"

@Injectable()
export class StatisticsService {
	constructor(
		private prisma: PrismaService,
		private userService: UserService,
	) {
	}

	async getMain({userId}:{userId: number}) {
		const user = await this.userService.byParam("id", userId, {
			orders: {
				select: { items: true },
			},
			reviews: true
		})

		// const totalAmount = await this.prisma.order.aggregate({
		// 	where: {
		// 		userId: user.id
		// 	},
		// 	_sum: {
		// 		items: true
		// 	}
		// })

		// for(let order of user.orders) {
		// 	let total = 0;
		// }

		return [
			{
				name: 'Orders',
				value: user.orders
			},
			{
				name: 'Reviews',
				value: user.reviews,
			},
			{
				name: 'Favorites',
				value: user.favorites,
			},
			{
				name: 'Total amount',
				value: 1000,
			},
		]
	}
}
