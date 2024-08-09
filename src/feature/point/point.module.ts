import { Module } from '@nestjs/common';
import { MemberPointRepository } from '@/feature/point/domain/member-point.repository';
import { MemberPointRepositoryImpl } from '@/feature/point/repository/member-point.repository.impl';
import { PointController } from '@/feature/point/controller/point.controller';
import { PointService } from '@/feature/point/service/point.service';

@Module({
  controllers: [
    PointController
  ],
  providers: [
    PointService,
    {
      provide: MemberPointRepository,
      useClass: MemberPointRepositoryImpl
    }
  ]
})
export class PointModule {}
