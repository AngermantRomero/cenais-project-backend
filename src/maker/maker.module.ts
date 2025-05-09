import { Module } from '@nestjs/common';
import { MakerController } from './maker.controller';
import { MakerService } from './maker.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/country/entities/country.entity';
import { Maker } from './entities/maker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Maker, Country])],
  controllers: [MakerController],
  providers: [MakerService],
  exports: [MakerModule, TypeOrmModule],
})
export class MakerModule {}
