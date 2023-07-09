import { Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { returnReviewObject } from "./objects/return-review.object"
import { ReviewDto } from "./dto/review.dto"

@Injectable()
export class ReviewService {
	constructor(private prisma: PrismaService) {
	}

	async getAll() {
		return this.prisma.review.findMany({
			orderBy: {
				createdAt: "desc",
			},
			select: returnReviewObject,
		})
	}

	async create({ productId, userId, dto }: { productId: number, userId: number, dto: ReviewDto }) {


		const isExistProduct = await this.prisma.product.findUnique({
			where: {
				id: productId
			}
		})

		if(!isExistProduct)	{
			throw new NotFoundException("Product not found")
		}

		return this.prisma.review.create({
			data: {
				...dto,
				product: {
					connect: {
						id: productId,
					},
				},
				user: {
					connect: {
						id: userId,
					},
				},
			},
		})
	}

	async getAverageValueProductId({productId}:{productId: number}) {
		return this.prisma.review.aggregate({
			where: {	productId },
			_avg:{
				rating: true
			}
		}).then(data => data._avg)
	}

}
