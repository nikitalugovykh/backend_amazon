import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common"
import { ReviewService } from './review.service';
import { ReviewDto } from "./dto/review.dto"
import { CurrentUser } from "../auth/decorators/user.decorator"
import { Auth } from "../auth/decorators/auth.decorator"

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // @UsePipes(new ValidationPipe())
  @Get()
  async getAll(){
    return this.reviewService.getAll()
  }
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @Post('leave/:productId')
  @Auth()
  async leaveReview(
    @CurrentUser('id') userId: number,
    @Param('productId') productId: number ,
    @Body() dto: ReviewDto
  ){
    return this.reviewService.create({productId: Number(productId), dto, userId: Number(userId)})
  }

}
