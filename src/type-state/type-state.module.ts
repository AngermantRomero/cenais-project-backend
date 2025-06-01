import { Module } from '@nestjs/common';
import { TypeStateController } from './type-state.controller';
import { TypeStateService } from './type-state.service';

@Module({
  controllers: [TypeStateController],
  providers: [TypeStateService]
})
export class TypeStateModule {}
