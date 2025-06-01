import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { RolesModule } from './roles/roles.module';
import { AuthModule } from './auth/auth.module';
import { SitesModule } from './sites/sites.module';
import { ProvinceModule } from './provinces/provinces.module';
import { EquipmentsModule } from './equipments/equipment.module';
import { MakerModule } from './maker/maker.module';
import { CountryModule } from './country/country.module';
import { ModelModule } from './model/model.module';
import { TypeEquipementModule } from './type-equipement/type-equipement.module';
import { TypeStateModule } from './type-state/type-state.module';
import { EquipmentStateHistoryModule } from './equipment-state-history/equipment-state-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().default(3306),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true,
        migrationsRun: true,
      }),
    }),
    AuthModule,
    RolesModule,
    UsersModule,
    SitesModule,
    ProvinceModule,
    EquipmentsModule,
    MakerModule,
    CountryModule,
    ModelModule,
    TypeEquipementModule,
    TypeStateModule,
    EquipmentStateHistoryModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
