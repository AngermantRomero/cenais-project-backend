import { CreateSiteDto } from './create-site.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateSitesDto extends PartialType(CreateSiteDto) {}
