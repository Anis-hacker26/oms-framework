/*
  Warnings:

  - A unique constraint covering the columns `[contactEmail]` on the table `Tenant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Tenant_contactEmail_key" ON "Tenant"("contactEmail");
