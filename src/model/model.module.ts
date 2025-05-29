import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelController } from './model.controller';
import { ModelService } from './model.service';
import { Model } from './entities/model.entity';
import { MakerModule } from '../maker/maker.module';

@Module({
  imports: [TypeOrmModule.forFeature([Model]), MakerModule],
  controllers: [ModelController],
  providers: [ModelService],
  exports: [ModelService],
})
export class ModelModule {}
