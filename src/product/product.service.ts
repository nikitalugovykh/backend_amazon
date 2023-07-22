import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { CategoryDto } from "../category/dto/category.dto"
import { generateSlug } from "../../utils/generate-slug"
import { PrismaService } from "../prisma.service"
import { returnProductFullestObject, returnProductObject } from "./objects/return-product.object"
import { ProductDto } from "./dto/product.dto"
import { GetAllProductDto } from "./dto/get-all.product.dto"
import { PaginationService } from "../pagination/pagination.service"

@Injectable()
export class ProductService {
	constructor(
		private prisma: PrismaService,
		private paginationService: PaginationService,
	) {
	}

	async getAll(dto: GetAllProductDto = {}) {
		const { sort, searchTerm } = dto

		const prismaSort: Prisma.ProductOrderByWithRelationInput[] = []

		if (sort === "HIGHEST_PRICE") {
			prismaSort.push({ price: "desc" })
		} else if (sort === "LOWEST_PRICE") {
			prismaSort.push({ price: "asc" })
		} else if (sort === "NEWEST") {
			prismaSort.push({ createdAt: "desc" })
		} else if (sort === "OLDEST") {
			prismaSort.push({ createdAt: "asc" })
		}


		const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm ? {
			OR: [
				{
					category: {
						name: {
							contains: searchTerm,
							mode: "insensitive",
						},
					},
				},
				{
					name: {
						contains: searchTerm,
						mode: "insensitive",
					},
				},
				{
					description: {
						contains: searchTerm,
						mode: "insensitive",
					},
				},
			],
		} : {}


		const { perPage, skip } = this.paginationService.getPagination(dto)

		const products = await this.prisma.product.findMany({
			where: prismaSearchTermFilter,
			orderBy: prismaSort,
			skip,
			take: perPage,
		})

		return {
			products,
			length: await this.prisma.product.count({
				where: prismaSearchTermFilter,
			}),
		}
	}


	async byParam(param: keyof Prisma.CategoryWhereUniqueInput, value: any) {
		const product = await this.prisma.product.findUnique({
			where: { [param]: value },
			select: returnProductFullestObject,
		})

		if (!product) {
			throw new NotFoundException("Product not found")
		}

		return product
	}

	async byCategory({ categorySlug }: { categorySlug: string }) {
		const product = await this.prisma.product.findMany({
			where: {
				category: {
					slug: categorySlug,
				},
			},
			select: returnProductFullestObject,
		})

		if (!product) {
			throw new NotFoundException("Product not found")
		}

		return product
	}

	async getSimilar({ id }: { id: number }) {
		const currentProduct = await this.byParam("id", id)

		const product = await this.prisma.product.findMany({
			where: {
				category: {
					name: currentProduct.category.name,
				},
				NOT: {
					id: currentProduct.id,
				},
			},
			orderBy: {
				createdAt: "desc",
			},
			select: returnProductObject,
		})


		return product
	}

	async update({ id, dto }: { id: number, dto: ProductDto }) {
		const product = await this.byParam("id", id)

		const { name, description, images, price, categoryId } = dto

		const category = this.prisma.category.findUnique({
			where: {
				id: categoryId,
			},
		})

		if (!category) {
			throw new BadRequestException("Category not found")
		}

		return this.prisma.product.update({
			where: { id },
			data: {
				description,
				images,
				price,
				name,
				// todo проверить функцию на русские буквы
				slug: generateSlug(name),
				category: {
					connect: {
						id: categoryId,
					},
				},
			},
		})
	}

	async delete({ id }: { id: number }) {
		return this.prisma.product.delete({
			where: { id },
		})
	}

	async create() {

		const existedEmptyProduct = await this.prisma.product.findUnique({
				where: {
					slug: "",
					name: "",
				},
			},
		)

		if(existedEmptyProduct) {
			return existedEmptyProduct.id
		}

		const newProduct = await this.prisma.product.create({
			data: {
				description: "",
				slug: "",
				name: "",
				price: 0,
			},
		})

		return newProduct.id
	}
}

