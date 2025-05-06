import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sites } from './entities/sites.entity';
import { SitesService } from './sites.service';
import { SitesController } from './sites.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sites])],
  controllers: [SitesController],
  providers: [SitesService],
})
export class SitesModule {}
