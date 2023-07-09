import { Controller, Get } from "@nestjs/common"
import { StatisticsService } from "./statistics.service"
import { Auth } from "../auth/decorators/auth.decorator"
import { CurrentUser } from "../auth/decorators/user.decorator"

@Controller("statistics")
export class StatisticsController {
	constructor(private readonly statisticsService: StatisticsService) {
	}

	@Get("main")
	@Auth()
	async getMainStatistics(
		@CurrentUser("id") id: number,
	) {
		return await this.statisticsService.getMain({ userId: Number(id) })
	}
}
