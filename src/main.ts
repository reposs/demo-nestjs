import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /////////////////////////////////////////////////////////////////
  // Activa la validación automática de DTOs en toda la aplicación
  // Activa la serialización automática (@Exclude, @Expose, etc.)
  /////////////////////////////////////////////////////////////////
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina del body cualquier propiedad no definida en el DTO
      forbidNonWhitelisted: true, // Lanza un error 400 si el cliente envía propiedades no permitidas
      transform: true, // Transforma automáticamente los payloads al tipo del DTO
    }),
  );
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  /////////////////////////////////////////////////////////////////

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
