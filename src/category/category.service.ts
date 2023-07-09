import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common"
import { PrismaService } from "../prisma.service"
import { returnCategoryObject } from "./objects/return-category.object"
import { CategoryDto } from "./dto/category.dto"
import { generateSlug } from "../../utils/generate-slug"
import { Category, Prisma } from "@prisma/client"

@Injectable()
export class CategoryService {
	constructor(private prisma: PrismaService) {
	}

	async byParam(param: keyof Prisma.CategoryWhereUniqueInput, value: any) {
		const category = await this.prisma.category.findUnique({
			where: { [param]: value },
			select: returnCategoryObject,
		})

		if (!category) {
			throw new NotFoundException("Category not found")
		}

		return category
	}
	async update({ id, dto }: { id: number, dto: CategoryDto }) {
		const category = await this.byParam('id', id)

		if (category && id !== category.id) {
			throw new BadRequestException("Category already in use")
		}

		return this.prisma.category.update({
			where: { id },
			data: {
				name: dto.name,
				slug: generateSlug(dto.name),
			},
		})
	}

	async delete({ id }: { id: number }) {
		return this.prisma.category.delete({
			where: { id },
		})
	}

	async create() {
		return this.prisma.category.create({
			data: {
				name: '',
				slug: ''
			}
		})
	}


	async getAll() {
		return this.prisma.category.findMany({
			select: returnCategoryObject
		})
	}


}
