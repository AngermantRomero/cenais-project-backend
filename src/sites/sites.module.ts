import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sitio } from './entities/sites.entity';
import { Provincia } from './entities/province.entity';
import { Codigo } from './entities/codes.entity';
import { SitiosService } from './sites.service';
import { SitiosController } from './sites.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Sitio, Provincia, Codigo])],
  controllers: [SitiosController],
  providers: [SitiosService],
})
export class SitiosModule {}
