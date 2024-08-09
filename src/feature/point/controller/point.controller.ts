import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PointService } from '@/feature/point/service/point.service';

@ApiTags('포인트')
@Controller('point')
export class PointController {

  constructor(
    @Inject()
    private readonly pointService: PointService
  ) {}

  @Get('balance')
  async getBalance(@Query('memberId') memberId: bigint) {
    const balance = await this.pointService.get(memberId);
    return { balance };
  }

  @Post('add')
  async credit(
    @Body() body: { memberId: bigint; amount: number; expirationAt: Date }
  ) {
    const { memberId, amount, expirationAt } = body;
    await this.pointService.add(memberId, amount, expirationAt);
    return 'ok';
  }

  @Post('use')
  async debit(@Body() body: { memberId: bigint; amount: number; transactionId: bigint }) {
    const { memberId, amount, transactionId } = body;
    await this.pointService.use(memberId, amount, transactionId);
    return 'ok';
  }

  @Post('refund')
  async refund(@Body() body: { memberId: bigint; amount: number; transactionId: bigint }) {
    const { memberId, amount, transactionId } = body;
    await this.pointService.refund(memberId, amount, transactionId);
    return 'ok';
  }

}
