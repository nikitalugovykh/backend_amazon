import {
	IsOptional,
	IsEnum,
	IsNumber,
	IsString
} from 'class-validator'
import { PaginationDto } from "../../pagination/dto/pagination.dto"

export enum ProductSort {
	HIGHEST_PRICE = 'HIGHEST_PRICE',
	LOWEST_PRICE = 'LOWEST_PRICE',
	NEWEST = 'NEWEST',
	OLDEST = 'OLDEST',
}

export class GetAllProductDto extends PaginationDto {
	@IsOptional()
	@IsEnum(ProductSort)
	sort?: ProductSort

	@IsOptional()
	@IsString()
	searchTerm?: string


}