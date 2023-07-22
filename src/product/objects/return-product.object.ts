import { Prisma } from "@prisma/client"
import { returnReviewObject } from "../../review/objects/return-review.object"
import { returnCategoryObject } from "../../category/objects/return-category.object"

export const returnProductObject: Prisma.ProductSelect = {
	images: true,
	description: true,
	id: true,
	name: true,
	price: true,
	createdAt: true,
	slug: true
}


export const returnProductFullestObject: Prisma.ProductSelect = {
	...returnProductObject,
	reviews: {
		select: returnReviewObject
	},
	category: {
		select: returnCategoryObject
	}
}
