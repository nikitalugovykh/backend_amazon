import { IsEmail, IsString, MinLength, IsOptional } from "class-validator"

export class UserDto {
	@IsEmail()
	email: string

	@IsOptional()
	@IsString()
	password?: string

	@IsOptional()
	@IsString()
	name?: string

	@IsOptional()
	@IsString()
	avatarPath?: string

	@IsOptional()
	@IsString()
	phone?: string
}