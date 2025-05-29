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
import { SiteFilterDto } from './dto/site-filters.dto';
import { Province } from 'src/provinces/entities/province.entity';
@Injectable()
export class SitesService {
  constructor(
    @InjectRepository(Sites)
    private sitesRepository: Repository<Sites>,
    @InjectRepository(Province)
    private provinceRepository: Repository<Province>,
  ) {}

  async createSite(siteDto: CreateSiteDto): Promise<Sites> {
    const existingSite = await this.sitesRepository.findOne({
      where: { code: siteDto.code, locality: siteDto.locality },
    });

    if (existingSite) {
      throw new ConflictException('El sitio ya está registrado');
    }

    const province = await this.provinceRepository.findOne({
      where: { id: siteDto.province },
    });

    if (!province) {
      throw new NotFoundException(
        `La provincia  con ID ${siteDto.province} no existe`,
      );
    }

    const { province: _, ...rest } = siteDto;

    const newSite = this.sitesRepository.create({
      ...rest,
      province,
    });

    return await this.sitesRepository.save(newSite);
  }

  async getSites(filters: SiteFilterDto): Promise<Sites[]> {
    const { locality, code, provinceId } = filters;
    const query = this.sitesRepository
      .createQueryBuilder('site')
      .leftJoinAndSelect('site.province', 'province');

    if (locality) {
      query.andWhere('site.locality LIKE :locality', {
        locality: `%${locality}%`,
      });
    }

    if (code) {
      query.andWhere('site.code LIKE :code', {
        code: `%${code}%`,
      });
    }

    if (provinceId) {
      query.andWhere('province.id = :provinceId', {
        provinceId,
      });
    }

    return query.getMany();
  }

  async getSite(id: string): Promise<Sites> {
    const site = await this.sitesRepository.findOne({
      where: { id },
      relations: ['province'],
    });
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

    if (siteDto.code || siteDto.locality) {
      const duplicateSite = await this.sitesRepository.findOne({
        where: {
          code: siteDto.code || existingSite.code,
          locality: siteDto.locality || existingSite.locality,
        },
      });
      if (duplicateSite && duplicateSite.id !== id) {
        throw new ConflictException(
          'Ya existe un sitio con ese código y localidad',
        );
      }
    }

    if (siteDto.province) {
      const province = await this.provinceRepository.findOne({
        where: { id: siteDto.province },
      });
      if (!province) {
        throw new NotFoundException(
          `La provincia con ID ${siteDto.province} no existe`,
        );
      }
      existingSite.province = province;
    }

    Object.assign(existingSite, siteDto);
    return this.sitesRepository.save(existingSite);
  }
}
