# Genak: NestJS Monolith Architecture

Genak is the backend of a multi-vendor ordering platform (customers, vendors and admins), built as a **modular monolith in NestJS**. It is a personal architecture project, not a production system.

I built the same platform twice, on purpose:

- **This repository**: one deployable application, organised into clear modules.
- **[genak-nest-microservices-architecture](https://github.com/mosabghorab/genak-nest-microservices-architecture)**: the same domain split into 19 services that communicate over RabbitMQ.

Building both let me compare the two architectures on the same problem, instead of in theory (see [Monolith vs. microservices](#monolith-vs-microservices) below).

## Architecture

```
  Clients ──▶ Nginx (port 80) ──▶ Genak (NestJS, port 3000) ──▶ PostgreSQL
                                   │
                                   ├── admin     module
                                   ├── customer  module
                                   ├── vendor    module
                                   └── shared    module (entities and services used by all)
```

- **One application, four modules** organised by audience: `admin`, `customer`, `vendor`, plus a `shared` module for the common domain.
- **Around 100 REST endpoints**, all URI-versioned (`/api/v1/...`).
- Inside each module: `controllers → services → TypeORM repositories`, with separate `dtos` and `validations` folders.

## Domain model

Orders (with items and a full status history), products, vendors and their service locations, customers and addresses, reviews, complaints, reasons, documents, attachments, on-boarding screens and settings. Admin access is controlled by **roles and permissions** (role-based access control) stored in the database.

## Cross-cutting concerns (`src/core`)

- **Global authentication guard** (JWT) applied to every route, driven by metadata decorators: `@Public()` for open endpoints, `@AllowFor(...)` to restrict a route to customers, vendors or admins, and permission metadata (`admin-must-can-do`) checked against the admin's roles.
- **Serialisation interceptor**: responses are mapped to DTOs, so internal fields never reach clients.
- **Unified API response class** for a consistent response shape.
- **Global response caching** (`@nestjs/cache-manager`, 10-second TTL), with the configuration ready for a Redis store.
- **Validation at the edge**: global `ValidationPipe` with whitelisting and transformation.
- Response compression, file uploads and static file serving.

## Deployment

- **Multi-stage Dockerfile** with separate `dev` and `prod` targets.
- `docker-compose-dev.yml`: the application with hot reload, plus PostgreSQL.
- `docker-compose-prod.yml`: production image published as `mosabghorab/genak-nest-monolith-architecture`.
- **Nginx** reverse proxy in front of the application.

## Monolith vs. microservices

| | Monolith (this repo) | Microservices |
|---|---|---|
| Deployment | One container | 19 containers, plus RabbitMQ and Nginx routing |
| Communication between parts | In-process function calls | RPC and events over RabbitMQ (50 message patterns) |
| Data access | One database connection, joins across the whole domain | Each service reaches other domains through messages |
| Consistency | Simple: one transaction can cover a whole operation | Harder: an operation may span several services |
| Development speed | Faster to build and debug | More setup, more moving parts |
| Scaling | Scale the whole application | Scale each service independently |

My conclusion: for a product of this size and team, the monolith is the better starting point. The microservices version earns its extra complexity only when parts of the system need to scale or be deployed independently.

## Tech stack

NestJS 10 · TypeScript · PostgreSQL · TypeORM · JWT · cache-manager · Docker (multi-stage) · Docker Compose · Nginx

## Running locally

```bash
docker compose -f docker-compose-dev.yml up --build
```

The API is then available at `http://localhost:3000/api/v1/...`.

## Author

Mosab Ghorab, software engineer (Flutter, NestJS)
