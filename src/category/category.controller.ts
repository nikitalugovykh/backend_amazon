import {
	Body,
	Controller, Delete,
	Get,
	HttpCode,
	HttpStatus,
	Param,
	Patch, Post,
	Put,
	UsePipes,
	ValidationPipe,
} from "@nestjs/common"
import { CategoryService } from "./category.service"
import { Auth } from "../auth/decorators/auth.decorator"
import { CategoryDto } from "./dto/category.dto"

@Controller("categories")
export class CategoryController {
	constructor(private readonly categoryService: CategoryService) {
	}

	@Get()
	@Auth()
	async getAll() {
		return this.categoryService.getAll()
	}

	@Get('by-slug/:slug')
	async getBySlug(@Param('slug') slug: string) {
		return this.categoryService.byParam('slug', slug)
	}

	@Get(':id')
	@Auth()
	async getById(@Param('id') id: number) {
		return this.categoryService.byParam('id', Number(id))
	}

	@UsePipes(new ValidationPipe())
	@Auth()
	@HttpCode(HttpStatus.OK)
	@Put(":id")
	async update(
		@Param("id") categoryId: number,
		@Body() dto: CategoryDto) {
		return this.categoryService.update({ id: Number(categoryId), dto })
	}

	@HttpCode(HttpStatus.CREATED)
	@Auth()
	@Post()
	async create(
	) {
		return this.categoryService.create()
	}

	@HttpCode(HttpStatus.OK)
	@Auth()
	@Delete(':id')
	async delete(
		@Param('id') categoryId: number,
	) {
		return this.categoryService.delete({id: Number(categoryId)})
	}


}
