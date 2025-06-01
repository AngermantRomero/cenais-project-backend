import { Module } from '@nestjs/common';
import { TypeStateController } from './type-state.controller';
import { TypeStateService } from './type-state.service';
import { TypeState } from './entities/type-state.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([TypeState]), // Esto hace que el Repository esté disponible
  ],
  controllers: [TypeStateController],
  providers: [TypeStateService],
  exports: [TypeStateService],
})
export class TypeStateModule {}
