import { IsString, IsNumber, Max, Min } from "class-validator"

export class ReviewDto {
	@IsString()
	text: string

	@IsNumber()
	@Max(5)
	@Min(1)
	rating: number
}