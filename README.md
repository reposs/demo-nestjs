<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<h1 align="center">Demo NestJS API (Portfolio Project)</h1>

> [!WARNING]
>
> ### ⚠️ Aviso de Uso Exclusivo para Demostración / Portfolio
>
> **Este repositorio es una muestra técnica de trabajo y está destinado únicamente a fines de exhibición en portfolio profesional.**
>
> - **Prohibida la clonación, copia o bifurcación (fork):** No está permitido clonar, descargar para reutilización, distribuir ni republicar este repositorio ni ninguna porción de su código fuente.
> - **Sin derechos de reutilización ni comerciales:** Queda prohibido el uso de este código en proyectos comerciales, privados o derivados sin consentimiento previo y por escrito del autor.
> - **Exclusión de licencias de código abierto:** Este proyecto **no** otorga derechos bajo la licencia MIT por defecto del template base ni bajo ninguna otra licencia permisiva de código abierto.

## Description

API RESTful profesional construida con [NestJS](https://nestjs.com/) y TypeScript. Implementa arquitectura modular, autenticación y autorización segura con JWT y Passport, persistencia relacional con PostgreSQL a través de TypeORM, validación rigurosa de DTOs, filtros globales de excepciones estandarizados (RFC 7807), endpoints paginados y documentación interactiva OpenAPI (Swagger).

## Demo online

Demo online: [https://demo-nestjs-myw0.onrender.com/](https://demo-nestjs-myw0.onrender.com/)

Documentación de la API: [https://demo-nestjs-myw0.onrender.com/docs](https://demo-nestjs-myw0.onrender.com/docs)

## Project setup

```bash
$ npm install
```

The `prepare` script automatically enables the native Git hooks after
installation. They format staged files with Prettier before each commit and
run the unit tests before each push. If needed, hooks can be enabled manually
with `$ npm run setup:hooks`.

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

Para una prueba sencilla puedes usar [Render](https://render.com), conectando
este repositorio de GitHub como un **Web Service**.

Configura estas variables en el servicio:

```env
DATABASE_URL=postgresql://postgres.bkcylzjbraxlhubixgbt:TU_PASSWORD@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
JWT_SECRET=una-clave-secreta-larga-y-segura
NODE_ENV=production
```

Configura el servicio con estos valores:

```text
Build Command: npm install && npm run build
Start Command: npm run start:prod
```

Añade `DATABASE_URL`, `JWT_SECRET` y `NODE_ENV=production` en las variables de
entorno de Render. No incluyas la contraseña de Supabase en el repositorio.

Después del deploy, deja la URL pública en esta sección para probarla:

```text
Public URL: https://demo-nestjs-myw0.onrender.com/
Health check: https://demo-nestjs-myw0.onrender.com/health
Swagger: https://demo-nestjs-myw0.onrender.com/docs
Login: POST https://demo-nestjs-myw0.onrender.com/auth/login
```

En el plan gratuito, el servicio puede pausarse cuando no recibe tráfico y
tardar unos segundos en responder al primer request. Las condiciones de los
planes pueden cambiar.

En producción `synchronize` está desactivado. La tabla `users` debe existir en
Supabase antes de iniciar el servicio.

## 📄 Licencia y Términos de Uso

**Todos los derechos reservados (All Rights Reserved).**

Este repositorio contiene código propietario diseñado exclusivamente con fines demostrativos y de evaluación técnica para el portfolio personal del autor:

- ⛔ **Prohibido clonar, copiar, distribuir, sublicenciar o comercializar** este repositorio o partes de él.
- ⛔ **Prohibido su uso en proyectos derivados o en entornos de producción** de terceros.
- ℹ️ Se **anula y sustituye expresamente cualquier licencia MIT o licencia abierta por defecto** proveniente del template inicial de NestJS.
