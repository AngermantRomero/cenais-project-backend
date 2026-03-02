import { Module } from '@nestjs/common';
import { TypeStateController } from './type-state.controller';
import { TypeStateService } from './type-state.service';
import { TypeState } from './entities/type-state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([TypeState])],
  controllers: [TypeStateController],
  providers: [TypeStateService],
  exports: [TypeOrmModule],
})
export class TypeStateModule {}
