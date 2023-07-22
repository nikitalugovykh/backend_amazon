import {
  Body,
  Controller, Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post, Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common"
import { ProductService } from './product.service';
import { GetAllProductDto } from "./dto/get-all.product.dto"
import { Auth } from "../auth/decorators/auth.decorator"
import { ProductDto } from "./dto/product.dto"

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() queryDto: GetAllProductDto) {
    return this.productService.getAll(queryDto)
  }

  @Get('similar/:id')
    async getSimilar(@Param('id') id: string) {
      return this.productService.getSimilar({id: Number(id)})
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.byParam('slug', slug)
  }

  @Get('by-category/:categorySlug')
  async getByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.byCategory({ categorySlug })
  }

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Post()
  async createProduct() {
    return this.productService.create()
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Auth()
  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: ProductDto) {
    return this.productService.update({id: Number(id), dto})
  }

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    return this.productService.delete({id: Number(id)})
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @Auth()
  async getProduct(@Param('id') id: string) {
    return this.productService.byParam('id', Number(id))
  }

}
