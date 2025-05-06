import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteResult } from 'typeorm';
import { Sites } from './entities/sites.entity';
import { CreateSiteDto } from './dto/create-site.dto';
import { UpdateSitesDto } from './dto/update-site.dto';
@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Sites)
    private sitesRepository: Repository<Sites>,
  ) {}

  async createSite(siteDto: CreateSiteDto): Promise<Sites> {
    const existingSite = await this.sitesRepository.findOne({
      where: { code: siteDto.code, locality: siteDto.locality },
    });

    if (existingSite) {
      throw new ConflictException('El sitio ya está registrado');
    }

    const newSite = this.sitesRepository.create(siteDto);

    return await this.sitesRepository.save(newSite);
  }

  async getSites(): Promise<Sites[]> {
    return this.sitesRepository.find();
  }

  async getSite(id: string): Promise<Sites> {
    const site = await this.sitesRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException('Sitio no encontrado');
    }
    return site;
  }

  async deleteSite(id: string): Promise<DeleteResult> {
    const site = await this.sitesRepository.findOne({ where: { id } });
    if (!site) {
      throw new NotFoundException('Sitio no encontrado');
    }
    return this.sitesRepository.delete(id);
  }

  async updateSite(id: string, siteDto: UpdateSitesDto): Promise<Sites> {
    const existingSite = await this.getSite(id);
    if (!existingSite) {
      throw new NotFoundException('Sitio no encontrado');
    }
    Object.assign(existingSite, siteDto);
    return this.sitesRepository.save(existingSite);
  }
}
