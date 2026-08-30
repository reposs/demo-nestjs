import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HealthModule } from '@/modules/health/health.module';

@Module({
  imports: [
    /////////////////////////////////////
    // dotenv ///////////////////////////
    /////////////////////////////////////
    ConfigModule.forRoot({
      isGlobal: true,
      // envFilePath: '.env', // Ruta por defecto si está en la raíz
    }),
    /////////////////////////////////////

    ///////////////////////////////////////////
    // Conectar con Bases de datos con TypeORM
    ///////////////////////////////////////////
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') !== 'production',
        ssl: { rejectUnauthorized: false },
      }),
    }),
    /////////////////////////////////////
    HealthModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
