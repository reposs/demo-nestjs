# Learning NestJS

## Install CLI NestJS

`npm i -g @nestjs/cli`

## Create new project

`nest new example-1`

## Uso de .env

`npm i @nestjs/config`

```app.module.ts
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

# Add validators in DTO

`npm i class-validator class-transformer`

`  @IsNotEmpty(),
  @isEmail()
  ...`

```main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /////////////////////////////////////////////////////////////////
  // Activa la validación automática de DTOs en toda la aplicación
  /////////////////////////////////////////////////////////////////
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina del body cualquier propiedad no definida en el DTO
      forbidNonWhitelisted: true, // Lanza un error 400 si el cliente envía propiedades no permitidas
      transform: true, // Transforma automáticamente los payloads al tipo del DTO
    }),
  );
  /////////////////////////////////////////////////////////////////

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## Add Swagger to project

`npm i @nestjs/swagger@^11.0.0`

```main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //////////////////////////////////////////////////
  // Configuración de swagger para la documentación
  //////////////////////////////////////////////////
  const config = new DocumentBuilder()
    .setTitle('API de Mi Aplicación')
    .setDescription('Documentación interactiva de la API de producción')
    .setVersion('1.0')
    .addBearerAuth() // Habilita el botón de autorización si usas JWT
    .build();
  // Creación del documento Swagger
  const document = SwaggerModule.createDocument(app, config);
  // Ruta pública donde se montará la interfaz visual (e.g., http://localhost:3000/docs)
  SwaggerModule.setup('docs', app, document);
  //////////////////////////////////////////////////

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
```

## Add TypeORM for connect with databases PostgreSQL

`npm install @nestjs/typeorm typeorm pg`

```app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
```

## Add JWT for authentication

`npm install @nestjs/jwt @nestjs/passport passport passport-jwt`

```auth.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';

@Module({
  imports: [
    /////////////////////////////////////
    // JWT
    /////////////////////////////////////
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: 3600 },
      }),
    }),
    /////////////////////////////////////
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
```
