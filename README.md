# OMS Framework

> A modular, enterprise-oriented Order Management System built with NestJS, Prisma, PostgreSQL, Redis, JWT authentication, RBAC, event infrastructure, scheduling, observability, automated testing, and performance optimization.

---

## Overview

**OMS Framework** is a production-oriented backend project designed to demonstrate how a scalable Order Management System can be architected using modern backend engineering practices.

The system separates business domains from reusable infrastructure, providing capabilities for **orders, payments, users, tenants, roles, notifications, auditing, caching, events, scheduling, storage, health monitoring, and observability**.

The project was developed through a structured **25-sprint engineering roadmap**, progressing from core business functionality to infrastructure, security hardening, testing, observability, and performance engineering.

### What this project demonstrates

* Modular backend architecture
* Multi-tenant system design
* JWT authentication and refresh-token management
* Role-based access control and permissions
* Order and payment lifecycle management
* Event-driven application infrastructure
* Redis-based caching infrastructure
* Background queue infrastructure
* Scheduled job infrastructure
* File-storage abstraction
* Audit logging
* Health and readiness checks
* Prometheus metrics
* OpenTelemetry tracing
* Automated unit and E2E testing
* API pagination and performance optimization
* Load testing with k6

---

# Architecture at a Glance

```text
                         ┌─────────────────────────┐
                         │        REST API         │
                         │      Controllers        │
                         └────────────┬────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │   Global Application    │
                         │                         │
                         │ Validation              │
                         │ API Response            │
                         │ Request Context         │
                         │ Logging                 │
                         │ Metrics                 │
                         └────────────┬────────────┘
                                      │
              ┌───────────────────────▼───────────────────────┐
              │                 Domain Layer                  │
              │                                               │
              │ Tenant │ Auth │ Users │ Roles │ Orders       │
              │ Payment │ Notification │ Audit               │
              └───────────────────────┬───────────────────────┘
                                      │
              ┌───────────────────────▼───────────────────────┐
              │             Infrastructure Layer              │
              │                                               │
              │ Prisma │ Redis │ Cache │ Events │ Queue       │
              │ Scheduler │ Storage │ Health │ Observability  │
              └───────────────────────┬───────────────────────┘
                                      │
                         ┌────────────▼────────────┐
                         │ External Infrastructure │
                         │                         │
                         │ PostgreSQL              │
                         │ Redis                   │
                         └─────────────────────────┘
```

The architecture keeps domain logic separated from infrastructure concerns, making individual components easier to test, maintain, and extend.

---

# Key Capabilities

## Order Management

The order domain supports a complete lifecycle:

```text
DRAFT
  ↓
PENDING
  ↓
APPROVED
  ↓
PROCESSING
  ↓
COMPLETED
```

Orders can also transition into states such as:

* Rejected
* On Hold
* Cancelled
* Failed
* Archived

Additional capabilities include:

* Multi-tenancy
* Tenant-scoped order numbers
* Metadata
* Soft deletion
* Optimistic locking
* Creation/update tracking
* Pagination
* Status management

---

## Authentication & Authorization

The security layer provides:

* JWT authentication
* Access tokens
* Refresh tokens
* Refresh-token persistence
* Token revocation
* Password hashing
* Role-based access control
* Permission-based authorization
* Protected API endpoints

The authorization model follows:

```text
User
 └── UserRole
      └── Role
           └── RolePermission
                └── Permission
```

This allows permissions to be managed through roles while supporting both tenant-specific and system-level roles.

---

## Multi-Tenancy

The database model is designed around tenant-aware data isolation.

Tenant relationships are implemented across major business entities including:

* Users
* Roles
* Orders
* Payments
* Notifications
* Audit logs

Tenant functionality includes:

* Activation
* Suspension
* Suspension reasons
* Soft deletion
* Metadata
* Audit timestamps
* Tenant-scoped constraints and indexes

---

## Payment Management

The payment domain supports multiple payment methods:

* Card
* UPI
* Bank Transfer
* Net Banking
* Wallet
* Cash
* Other

Payment lifecycle states include:

```text
PENDING
AUTHORIZED
PROCESSING
COMPLETED
FAILED
CANCELLED
REFUNDED
```

Payments also support:

* Provider information
* Payment references
* Gateway transaction IDs
* Failure reasons
* Metadata
* Optimistic locking
* Soft deletion
* Tenant isolation
* Pagination

---

## Notifications

The notification system supports:

* Email
* SMS
* Push
* In-App

Notification types include:

* Information
* Success
* Warning
* Error
* System

Notification states include:

```text
PENDING
SENT
DELIVERED
READ
FAILED
ARCHIVED
```

Additional capabilities include:

* Read tracking
* Archive tracking
* Metadata
* Tenant association
* Recipient association
* Optimistic locking

---

# Reusable Infrastructure

One of the primary design goals of the project is to keep infrastructure reusable across business domains.

## Event Infrastructure

The event module provides domain-event infrastructure for loosely coupled application workflows.

```text
Order Service
      │
      ▼
 Domain Event
      │
      ▼
   Event Bus
      │
 ┌────┼────────────┐
 ▼    ▼            ▼
Audit Notification Other Consumer
```

This allows event publishers and consumers to remain decoupled.

---

## Scheduler

A dedicated scheduler module provides reusable infrastructure for scheduled jobs.

Potential applications include:

* Periodic processing
* Background maintenance
* Cleanup operations
* Scheduled business workflows

---

## Redis & Cache

Redis is integrated through dedicated infrastructure modules.

The abstraction separates Redis connection management from business services and provides a reusable caching layer.

---

## Queue Infrastructure

The project includes queue infrastructure for asynchronous and background processing.

The queue layer is separated from HTTP request handling so background workloads can be introduced without coupling them directly to synchronous API operations.

---

## File Storage

The storage module provides an abstraction for file-storage operations.

Keeping storage behind an abstraction allows implementations to be extended or replaced without changing business-domain logic.

---

# Audit Logging

The audit system provides traceability for important application activities.

Audit records support:

* Action
* Entity type
* Entity ID
* Description
* Severity
* User
* Tenant
* IP address
* User agent
* Request ID
* Correlation ID
* Metadata
* Timestamp

Tracked activities include operations such as:

```text
CREATE
UPDATE
DELETE
LOGIN
LOGOUT
LOGIN_FAILED
ACTIVATE
SUSPEND
ASSIGN_ROLE
REMOVE_ROLE
PASSWORD_CHANGE
CREATE_ORDER
UPDATE_ORDER
CANCEL_ORDER
PAYMENT_INITIATED
PAYMENT_SUCCESS
PAYMENT_FAILED
PAYMENT_REFUNDED
NOTIFICATION_SENT
NOTIFICATION_FAILED
EXPORT
CUSTOM
```

---

# Security & Configuration

Application configuration is centralized through a dedicated configuration module.

Sensitive values are supplied through environment variables rather than being embedded in application code.

**No real credentials, passwords, tokens, API keys, private keys, or environment-specific secrets are included in this README or intended to be committed to the repository.**

For local development, create your own environment configuration using values appropriate for your machine.

Example structure:

```env
DATABASE_URL=<your-database-url>

JWT_ACCESS_SECRET=<your-access-secret>
JWT_REFRESH_SECRET=<your-refresh-secret>

JWT_ACCESS_EXPIRES_IN=<your-access-token-expiry>
JWT_REFRESH_EXPIRES_IN=<your-refresh-token-expiry>

BCRYPT_SALT_ROUNDS=<your-configured-value>

REDIS_HOST=<your-redis-host>
REDIS_PORT=<your-redis-port>
REDIS_USERNAME=<optional-username>
REDIS_PASSWORD=<optional-password>
REDIS_DB=<your-redis-database>

QUEUE_PREFIX=<your-queue-prefix>
QUEUE_DEFAULT_NAME=<your-default-queue-name>
```

> These are placeholders only. Never replace them with real credentials in documentation.

---

# Health & Readiness

The application provides health and readiness infrastructure for monitoring application dependencies.

The health layer includes checks for infrastructure such as:

* PostgreSQL
* Redis

This provides a foundation for containerized deployments and orchestration environments.

---

# Observability

Observability is implemented as a dedicated application capability.

The system includes:

* HTTP request logging
* Request context
* Request/correlation identifiers
* HTTP metrics
* Prometheus metrics
* OpenTelemetry tracing
* Exception-aware HTTP status logging

Global application interceptors include:

```text
ApiResponseInterceptor
RequestContextInterceptor
HttpMetricsInterceptor
HttpLoggingInterceptor
```

The HTTP logging implementation correctly captures exception-derived HTTP status codes, avoiding misleading success status values when requests fail.

---

# API Validation

Request validation is applied globally using NestJS `ValidationPipe`.

```typescript
new ValidationPipe({
  whitelist: true,
  transform: true,
  forbidNonWhitelisted: true,
})
```

This provides:

* DTO-based validation
* Automatic transformation
* Whitelisted request properties
* Rejection of unexpected properties

---

# API Documentation

Swagger/OpenAPI documentation is integrated into the application.

Once the application is running locally:

```text
http://localhost:<PORT>/api
```

Swagger provides interactive API documentation and supports JWT Bearer authentication for protected endpoints.

---

# Technology Stack

| Technology        | Purpose                      |
| ----------------- | ---------------------------- |
| TypeScript        | Primary programming language |
| NestJS            | Backend framework            |
| Prisma            | ORM and database access      |
| PostgreSQL        | Relational database          |
| Redis             | Cache and infrastructure     |
| BullMQ            | Queue infrastructure         |
| JWT               | Authentication               |
| Passport          | Authentication strategy      |
| bcrypt            | Password hashing             |
| Swagger / OpenAPI | API documentation            |
| Jest              | Unit testing                 |
| Supertest         | E2E testing                  |
| k6                | Load testing                 |
| Prometheus        | Metrics                      |
| OpenTelemetry     | Distributed tracing          |
| Docker            | Infrastructure and testing   |

---

# Project Structure

```text
oms-framework/
│
├── docker/
│   └── docker-compose.yml
│
├── docs/
│   └── sprints/
│
├── load-tests/
│
├── prisma/
│   └── schema.prisma
│
├── src/
│   ├── common/
│   ├── database/
│   │
│   └── modules/
│       ├── audit/
│       ├── auth/
│       ├── cache/
│       ├── config/
│       ├── event/
│       ├── health/
│       ├── notification/
│       ├── observability/
│       ├── orders/
│       ├── payment/
│       ├── queue/
│       ├── redis/
│       ├── roles/
│       ├── scheduler/
│       ├── storage/
│       ├── tenant/
│       └── users/
│
├── test/
│   ├── app.e2e-spec.ts
│   ├── payment.e2e-spec.ts
│   ├── tenant.e2e-spec.ts
│   └── jest-e2e.json
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# Getting Started

## Prerequisites

Install:

* Node.js
* npm
* Docker Desktop

The application requires PostgreSQL and Redis.

---

## Clone the Repository

```bash
git clone https://github.com/Anis-hacker26/oms-framework.git
cd oms-framework
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure the Environment

Create a local `.env` file and configure the required application settings.

Use your own development credentials and infrastructure configuration.

Do not commit `.env` or other environment-specific configuration files to source control.

---

## Start Infrastructure

```bash
docker compose -f docker/docker-compose.yml up -d
```

---

## Generate Prisma Client

```bash
npx prisma generate
```

Apply the database schema or migrations according to the Prisma configuration.

---

## Run the Application

### Development

```bash
npm run start:dev
```

### Production Build

```bash
npm run build
```

### Production

```bash
npm run start:prod
```

---

# Testing

The project includes unit, integration/E2E, and performance testing.

## Unit Tests

```bash
npm test
```

Current verification:

```text
Test Suites: 42 passed
Tests:       211 passed
Failures:    0
```

---

## Test Coverage

```bash
npm run test:cov -- --runInBand
```

Current measured overall coverage:

| Metric     | Coverage |
| ---------- | -------: |
| Statements |   49.83% |
| Branches   |   48.39% |
| Functions  |   44.61% |
| Lines      |   49.34% |

Coverage is focused on meaningful application and infrastructure behavior rather than an arbitrary coverage target.

Several infrastructure areas have strong targeted coverage, including configuration, health checks, scheduler, storage, and observability.

---

## End-to-End Tests

```bash
npm run test:e2e
```

Current verification:

```text
Test Suites: 3 passed
Tests:       43 passed
Failures:    0
```

---

# Performance Engineering

Performance optimization focused on reducing unnecessary response payloads and improving list endpoint performance.

Pagination was introduced for Orders and Payments endpoints and evaluated using k6 load testing.

---

## Orders

### Before Pagination

| Metric     |       Result |
| ---------- | -----------: |
| Average    |    190.36 ms |
| Median     |    172.29 ms |
| P90        |    315.44 ms |
| P95        |    350.47 ms |
| Throughput | 22.659 req/s |

### After Pagination

| Metric     |        Result |
| ---------- | ------------: |
| Average    |      42.15 ms |
| Median     |      38.72 ms |
| P90        |      65.37 ms |
| P95        |      70.96 ms |
| Throughput | 100.868 req/s |

Received data decreased from approximately **1.7 GB to 85 MB** during the compared workloads.

---

## Payments

### Before Pagination

| Metric     |        Result |
| ---------- | ------------: |
| Average    |     263.68 ms |
| Median     |     237.95 ms |
| P90        |     445.45 ms |
| P95        |     490.47 ms |
| Throughput | 16.3755 req/s |

### After Pagination

| Metric     |       Result |
| ---------- | -----------: |
| Average    |     47.48 ms |
| Median     |     45.58 ms |
| P90        |     71.59 ms |
| P95        |     77.51 ms |
| Throughput | 89.394 req/s |

Received data decreased from approximately **1.6 GB to 100 MB** during the compared workloads.

### Final Payments Load Test

```text
Requests:       16,194
Failures:       0.00%
Average:        47.48 ms
Median:         45.58 ms
P90:            71.59 ms
P95:            77.51 ms
Maximum:        1.12 s
Throughput:     89.394 req/s
```

Detailed performance documentation:

```text
docs/sprints/sprint-24-performance-pagination.md
```

---

# Performance Approach

The optimization focused on reducing unnecessary database and network payloads.

Key changes included:

* Pagination for list endpoints
* Page/limit parameters
* Paginated response metadata
* Reduced response payload size
* Load testing with k6
* Before/after performance measurement

Example response structure:

```json
{
  "items": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

# Docker

Docker is used to simplify local infrastructure setup and testing.

Start the infrastructure with:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Docker was also used to run k6 performance tests without requiring a native k6 installation.

---

# Engineering Highlights

### Modular Architecture

Business domains and reusable infrastructure are separated into dedicated NestJS modules.

### Multi-Tenancy

Tenant-aware relationships, constraints, and indexes provide a foundation for isolated organizational data.

### Security

JWT authentication, refresh-token management, password hashing, RBAC, permissions, request validation, and environment-based configuration are implemented.

### Reliability

Health checks, readiness infrastructure, exception handling, optimistic locking, and automated integration testing support reliable backend operation.

### Observability

Logging, request context, metrics, Prometheus instrumentation, and OpenTelemetry tracing provide visibility into application behavior.

### Performance

Pagination and load testing significantly improved latency, throughput, and response payload size for high-volume list endpoints.

### Testability

The project includes:

* Unit tests
* E2E tests
* Coverage measurement
* Performance tests

---

# 25-Sprint Development Roadmap

The system was developed through a structured 25-sprint engineering roadmap.

| Sprint | Area                               | Status |
| -----: | ---------------------------------- | :----: |
|   1–15 | Core OMS development               |    ✅   |
|  16–17 | Event infrastructure & integration |    ✅   |
|     18 | Scheduler                          |    ✅   |
|     19 | File Storage                       |    ✅   |
|     20 | Configuration & Secrets Hardening  |    ✅   |
|     21 | Health Checks                      |    ✅   |
|     22 | Observability                      |    ✅   |
|     23 | Integration Tests                  |    ✅   |
|     24 | Performance & Pagination           |    ✅   |
|     25 | Documentation & Sample Host        |    ✅   |

The roadmap covers the evolution of the system from core business functionality into a more complete backend engineering platform.

---

# Final Verification

The final implementation verification includes:

```text
Unit Tests
42 suites passed
211 tests passed

E2E Tests
3 suites passed
43 tests passed

Build
PASS

Git Working Tree
Clean

Remote
Up to date with origin/main
```

---

# Future Improvements

Potential future extensions include:

* CI/CD pipeline
* Production deployment configuration
* Advanced distributed tracing
* Message broker integration
* Additional payment-provider adapters
* Object-storage providers
* Advanced rate limiting
* API versioning
* Background worker scaling
* Kubernetes deployment
* Expanded integration testing

These represent potential extensions to the existing architecture rather than requirements for the current implementation.

---

# Project Status

| Area                    |   Status   |
| ----------------------- | :--------: |
| Core OMS                | ✅ Complete |
| Authentication & RBAC   | ✅ Complete |
| Multi-Tenancy           | ✅ Complete |
| Event Infrastructure    | ✅ Complete |
| Scheduler               | ✅ Complete |
| Redis / Cache           | ✅ Complete |
| File Storage            | ✅ Complete |
| Configuration Hardening | ✅ Complete |
| Health Checks           | ✅ Complete |
| Observability           | ✅ Complete |
| Integration Testing     | ✅ Complete |
| Performance Testing     | ✅ Complete |
| Documentation           | ✅ Complete |

---

# Repository

**GitHub:**
https://github.com/Anis-hacker26/oms-framework

---

# Author

**Anisha Prasad**

Backend & Security Engineering Portfolio Project
