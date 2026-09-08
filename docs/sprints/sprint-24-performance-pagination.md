# Sprint 24 — Performance Optimization: Orders & Payments Pagination

## 1. Sprint Overview

**Sprint:** 24
**Focus:** API performance optimization and load testing
**Primary Areas:** Orders and Payments
**Technology:** NestJS, Prisma, PostgreSQL, k6
**Status:** Completed
**Git Commit:** `bb9f6c8`
**Commit Message:** `perf: add pagination and load testing for orders and payments`

---

## 2. Objective

The objective of Sprint 24 was to identify and reduce performance bottlenecks in the Orders and Payments read APIs.

The primary problem identified was that the list endpoints returned the complete collection of records for a tenant. As the number of records increased, this resulted in:

* Larger HTTP response payloads
* Increased network transfer
* Increased serialization/deserialization overhead
* Higher API response latency
* Lower achievable throughput under load
* Increased memory and processing requirements

The solution was to introduce reusable pagination infrastructure and apply pagination to the Orders and Payments list endpoints.

---

## 3. Problem Identified

Before pagination, the list APIs retrieved all matching records.

Conceptually, the behavior was:

```text
Client
   │
   │ GET /orders
   ▼
Orders Controller
   │
   ▼
Orders Service
   │
   ▼
Orders Repository
   │
   ▼
Prisma findMany()
   │
   ▼
All matching records
   │
   ▼
Large HTTP response
```

The same pattern existed for Payments.

This approach works with small datasets, but becomes increasingly expensive as the number of records grows.

For example, if a tenant has hundreds or thousands of records, requesting the list endpoint without pagination can result in a large database result set and large HTTP response.

---

## 4. Solution Implemented

Pagination was introduced using a reusable pagination structure.

The implementation provides:

* `page`
* `limit`
* `totalItems`
* `totalPages`
* `hasPreviousPage`
* `hasNextPage`

The API now returns a bounded number of records per request.

Example:

```http
GET /orders?page=1&limit=10
```

and:

```http
GET /payments?page=1&limit=10
```

---

## 5. Shared Pagination Infrastructure

A reusable pagination result interface was introduced:

```text
src/common/pagination/interfaces/paginated-result.interface.ts
```

The interface represents repository results using:

```text
items
totalItems
```

This keeps database-level pagination results separate from API response metadata.

The existing pagination DTO infrastructure was reused for:

* Page number
* Page size
* Default values
* Maximum page size

The pagination constants provide:

* Default page: `1`
* Default limit: `10`
* Maximum limit: `100`
* Default sort field: `createdAt`

---

## 6. Orders Pagination

Orders were updated to support paginated retrieval.

### Controller

The Orders controller now accepts pagination query parameters through the list DTO.

Example:

```http
GET /orders?page=1&limit=10
```

### DTO

The existing:

```text
src/modules/orders/dto/list-orders.dto.ts
```

was integrated with the common pagination DTO.

### Repository

The Orders repository was updated to return:

```text
PaginatedResult<Order>
```

instead of returning the complete list.

Prisma pagination uses:

```text
skip = (page - 1) * limit
take = limit
```

The query also calculates the total number of matching records.

### Service

The Orders service converts the repository result into:

```text
PageDto<OrderResponse>
```

This provides the API consumer with both the requested records and pagination metadata.

---

## 7. Payments Pagination

Payments were updated using the same pagination architecture.

### Controller

The Payments controller now accepts:

```text
ListPaymentsDto
```

through the query parameters.

Example:

```http
GET /payments?page=1&limit=10
```

### DTO

A new DTO was added:

```text
src/modules/payment/dto/list-payments.dto.ts
```

It extends the common:

```text
PageOptionsDto
```

### Repository

The Payment repository was changed from:

```text
findAll(tenantId: string): Promise<Payment[]>
```

to a paginated repository contract based on:

```text
PaymentListFilters
```

and:

```text
PaginatedResult<Payment>
```

The Prisma implementation uses:

```text
skip
take
```

and performs the record retrieval and total count concurrently.

Conceptually:

```text
┌─────────────────────┐
│ Prisma Payment      │
│ Query               │
└──────────┬──────────┘
           │
           ├──────────────► findMany()
           │                skip + take
           │
           └──────────────► count()
           
                 │
                 ▼
        PaginatedResult
        ┌─────────────────┐
        │ items           │
        │ totalItems      │
        └─────────────────┘
```

### Service

The Payment service maps:

```text
result.items
```

to the API response list and constructs pagination metadata using:

```text
PageMetaDto
```

The final response is wrapped using:

```text
PageDto<PaymentResponse>
```

---

## 8. API Response Structure

After pagination, the list response follows a structure similar to:

```json
{
  "success": true,
  "message": "Payments retrieved successfully.",
  "data": {
    "items": [],
    "meta": {
      "page": 1,
      "limit": 10,
      "totalItems": 980,
      "totalPages": 98,
      "hasPreviousPage": false,
      "hasNextPage": true
    }
  }
}
```

The exact number of records depends on the current database state.

The important architectural change is that:

```text
data.items
```

contains only the requested page rather than the entire collection.

---

# 9. Performance Testing Strategy

Performance was measured before and after pagination.

The testing process consisted of:

1. Establishing a baseline.
2. Measuring Orders without pagination.
3. Measuring Payments without pagination.
4. Implementing pagination.
5. Re-running the Orders load test.
6. Re-running the Payments load test.
7. Comparing latency, throughput, failures, and network transfer.
8. Validating the paginated response using k6 checks.
9. Running the full E2E test suite.

The load tests were implemented using:

```text
load-tests/
├── config/
├── results/
└── scenarios/
```

Relevant scenarios include:

```text
orders-read-load.js
payments-read-load.js
```

---

# 10. Baseline Performance

The initial baseline test produced:

| Metric          |   Baseline |
| --------------- | ---------: |
| Iterations      |        350 |
| HTTP Requests   |      1,750 |
| Failures        |         0% |
| Checks          |       100% |
| Average latency |  252.31 ms |
| Median latency  |   69.39 ms |
| p90 latency     |  997.47 ms |
| p95 latency     |     1.06 s |
| Maximum latency |     1.53 s |
| Throughput      | 9.67 req/s |
| Data received   |    ~274 MB |

This provided the initial performance reference point for the application.

---

# 11. Orders Performance — Before Pagination

The Orders read test before pagination produced:

| Metric          |      Before |
| --------------- | ----------: |
| HTTP Requests   |       4,101 |
| Average latency |   190.36 ms |
| Median latency  |   172.29 ms |
| p90 latency     |   315.44 ms |
| p95 latency     |   350.47 ms |
| Maximum latency |   974.41 ms |
| Throughput      | 22.66 req/s |
| Data received   |     ~1.7 GB |
| Failure rate    |          0% |

The most important observation was the amount of data transferred.

Approximately:

```text
1.7 GB
```

was received during the test.

This indicated that the API was repeatedly transferring large result sets.

---

# 12. Orders Performance — After Pagination

After implementing pagination, the Orders read test produced:

| Metric          |        After |
| --------------- | -----------: |
| HTTP Requests   |       18,276 |
| Average latency |     42.15 ms |
| Median latency  |     38.72 ms |
| p90 latency     |     65.37 ms |
| p95 latency     |     70.96 ms |
| Maximum latency |       1.17 s |
| Throughput      | 100.87 req/s |
| Data received   |       ~85 MB |
| Failure rate    |           0% |

### Orders improvement

Median latency:

```text
172.29 ms → 38.72 ms
```

Reduction:

```text
~77.5%
```

p95 latency:

```text
350.47 ms → 70.96 ms
```

Reduction:

```text
~79.8%
```

Throughput:

```text
22.66 req/s → 100.87 req/s
```

Improvement:

```text
~4.45×
```

Data received:

```text
~1.7 GB → ~85 MB
```

Reduction:

```text
~95%
```

---

# 13. Payments Performance — Before Pagination

The Payments read test before pagination produced:

| Metric          |      Before |
| --------------- | ----------: |
| HTTP Requests   |       2,965 |
| Average latency |   263.68 ms |
| Median latency  |   237.95 ms |
| p90 latency     |   445.45 ms |
| p95 latency     |   490.47 ms |
| Maximum latency |     ~1.00 s |
| Throughput      | 16.38 req/s |
| Data received   |     ~1.6 GB |
| Failure rate    |          0% |

Again, the large amount of data transferred was a clear indication that the endpoint was returning too much data per request.

---

# 14. Payments Performance — After Pagination

After implementing pagination, the Payments read test produced:

| Metric          |       After |
| --------------- | ----------: |
| HTTP Requests   |      16,194 |
| Average latency |    47.48 ms |
| Median latency  |    45.58 ms |
| p90 latency     |    71.59 ms |
| p95 latency     |    77.51 ms |
| Maximum latency |      1.12 s |
| Throughput      | 89.39 req/s |
| Data received   |     ~100 MB |
| Failure rate    |          0% |

### Payments improvement

Average latency:

```text
263.68 ms → 47.48 ms
```

Reduction:

```text
~82.0%
```

Median latency:

```text
237.95 ms → 45.58 ms
```

Reduction:

```text
~80.8%
```

p90 latency:

```text
445.45 ms → 71.59 ms
```

Reduction:

```text
~83.9%
```

p95 latency:

```text
490.47 ms → 77.51 ms
```

Reduction:

```text
~84.2%
```

Throughput:

```text
16.38 req/s → 89.39 req/s
```

Improvement:

```text
~5.46×
```

Data received:

```text
~1.6 GB → ~100 MB
```

Reduction:

```text
~93.8%
```

---

# 15. Before vs After Summary

| Metric        | Orders Before |     Orders After | Payments Before |  Payments After |
| ------------- | ------------: | ---------------: | --------------: | --------------: |
| Average       |     190.36 ms |     **42.15 ms** |       263.68 ms |    **47.48 ms** |
| Median        |     172.29 ms |     **38.72 ms** |       237.95 ms |    **45.58 ms** |
| p90           |     315.44 ms |     **65.37 ms** |       445.45 ms |    **71.59 ms** |
| p95           |     350.47 ms |     **70.96 ms** |       490.47 ms |    **77.51 ms** |
| Throughput    |   22.66 req/s | **100.87 req/s** |     16.38 req/s | **89.39 req/s** |
| Data received |       ~1.7 GB |        **85 MB** |         ~1.6 GB |      **100 MB** |
| Failures      |            0% |           **0%** |              0% |          **0%** |

---

# 16. k6 Validation

The Payments pagination load test was executed through Docker because k6 was not installed natively on the development machine.

The test used:

```text
grafana/k6
```

and executed the scenario:

```text
load-tests/scenarios/payments-read-load.js
```

The test endpoint was:

```http
GET /payments?page=1&limit=10
```

The test validated:

* Login succeeds.
* Access token is returned.
* Payments endpoint returns HTTP 200.
* `data.items` is an array.
* Pagination metadata exists.
* The page contains no more than 10 items.

### Final Payments k6 result

```text
HTTP requests:        16,194
HTTP failures:        0.00%
Checks:                64,774 / 64,774
Checks passed:         100%
Average latency:       47.48 ms
Median latency:        45.58 ms
p90 latency:           71.59 ms
p95 latency:           77.51 ms
Throughput:            89.39 req/s
Data received:         ~100 MB
```

The test threshold:

```text
http_req_failed < 1%
```

was satisfied:

```text
rate = 0.00%
```

---

# 17. End-to-End Validation

The full E2E test suite was executed after the pagination implementation.

Command:

```powershell
npm run test:e2e
```

Result:

```text
Test Suites: 3 passed, 3 total
Tests:       43 passed, 43 total
```

Therefore:

```text
3/3 test suites passed
43/43 tests passed
```

The Payment E2E test was also updated to validate the new pagination response structure.

The test verifies:

* Payment list response is successful.
* `data.items` is an array.
* Pagination metadata exists.
* The created payment can be found inside the paginated result.
* Page number is correct.
* Limit is correct.
* The returned page contains no more than 10 items.

---

# 18. Build Validation

The application build was executed using:

```powershell
npm run build
```

Result:

```text
Build passed successfully.
```

No TypeScript or NestJS compilation errors were reported.

---

# 19. Observability Finding

During E2E testing, the application produced logs such as:

```text
event: request.failed
statusCode: 200
```

and:

```text
event: request.failed
statusCode: 201
```

These requests were actually successful.

For example:

```text
POST /tenants
statusCode: 201
event: request.failed
```

and:

```text
GET /tenants/:id
statusCode: 200
event: request.failed
```

This indicates an observability issue in the HTTP logging/interceptor flow.

The interceptor appears to log the failure before the final response status is available or finalized.

### Impact

This does not currently indicate an API functional failure because:

```text
E2E tests: 43/43 passed
HTTP status: 2xx
```

However, it can produce misleading application logs and make operational monitoring less reliable.

### Follow-up

The HTTP logging interceptor should be reviewed separately so that:

```text
request.failed
```

is emitted only when the request actually results in an unsuccessful response or exception.

This issue was intentionally kept separate from the pagination implementation.

---

# 20. Files Added or Modified

### Shared pagination

```text
src/common/pagination/interfaces/paginated-result.interface.ts
```

### Orders

```text
src/modules/orders/controllers/orders.controller.ts
src/modules/orders/dto/list-orders.dto.ts
src/modules/orders/interfaces/order-list-filters.interface.ts
src/modules/orders/repositories/order.repository.ts
src/modules/orders/repositories/prisma-order.repository.ts
src/modules/orders/services/orders.service.ts
```

### Payments

```text
src/modules/payment/controllers/payment.controller.ts
src/modules/payment/dto/list-payments.dto.ts
src/modules/payment/interfaces/payment-list-filters.interface.ts
src/modules/payment/repositories/payment.repository.ts
src/modules/payment/repositories/prisma-payment.repository.ts
src/modules/payment/services/payment.service.ts
```

### Tests

```text
test/payment.e2e-spec.ts
```

### Load testing

```text
load-tests/config/local.json
load-tests/results/baseline-10vus-30s.txt
load-tests/scenarios/auth-only.js
load-tests/scenarios/auth-tenant.js
load-tests/scenarios/baseline.js
load-tests/scenarios/health.js
load-tests/scenarios/login-load.js
load-tests/scenarios/order-payment.js
load-tests/scenarios/orders-read-load.js
load-tests/scenarios/payments-read-load.js
```

---

# 21. Engineering Outcome

Sprint 24 successfully addressed a major scalability issue in the Orders and Payments list APIs.

The implementation changed the APIs from returning potentially large collections to returning bounded pages of records.

The performance tests demonstrated substantial improvements in:

* Response latency
* p95 latency
* Throughput
* Network utilization
* Response payload size

Most importantly, the improvement was validated under load rather than being based only on code-level assumptions.

The results demonstrate that pagination significantly reduced the amount of data transferred and allowed the API to process substantially more requests per second.

---

# 22. Key Takeaways

### Before

```text
Large collection
      ↓
Large database result
      ↓
Large API response
      ↓
High network transfer
      ↓
Higher latency
      ↓
Lower throughput
```

### After

```text
Client requests page
      ↓
Prisma skip + take
      ↓
Bounded result set
      ↓
Small API response
      ↓
Lower network transfer
      ↓
Lower latency
      ↓
Higher throughput
```

The key lesson from Sprint 24 is that API performance is not only about reducing application execution time. **Controlling the amount of data retrieved and transferred can have a major impact on end-to-end system performance.**

---

# 23. Git Commit

Sprint 24 was committed using:

```text
Commit: bb9f6c8
Message: perf: add pagination and load testing for orders and payments
```

The commit was successfully pushed to:

```text
origin/main
```

The unrelated pre-existing working-tree changes were intentionally left unstaged and were not included in the Sprint 24 commit.

---

# 24. Sprint 24 Completion Checklist

* [x] Identify Orders/Payments list performance bottleneck
* [x] Establish baseline performance
* [x] Implement reusable pagination infrastructure
* [x] Implement Orders pagination
* [x] Implement Payments pagination
* [x] Add pagination metadata
* [x] Update Payment E2E tests
* [x] Run full build
* [x] Run full E2E suite
* [x] Create Orders load-test scenario
* [x] Create Payments load-test scenario
* [x] Run post-pagination load tests
* [x] Compare before/after performance
* [x] Verify zero HTTP failures
* [x] Verify pagination limits under load
* [x] Document observability issue
* [x] Commit changes
* [x] Push changes to GitHub

---

# 25. Final Status

## Sprint 24 — COMPLETE ✅

The Orders and Payments APIs now support paginated reads, and the implementation has been validated through build checks, E2E tests, and k6 load testing.

The measured results provide strong evidence that pagination substantially improved API scalability and reduced unnecessary network transfer.

**Next follow-up:** Review and fix the false `request.failed` HTTP logging behavior as a separate observability improvement.
