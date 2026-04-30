-- CreateEnum
CREATE TYPE "lead_source" AS ENUM ('WEBSITE', 'REFERRAL', 'PAID_ADS', 'ORGANIC', 'OTHER');

-- CreateTable
CREATE TABLE "leads" (
    "id" TEXT NOT NULL,
    "full_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "company_name" VARCHAR(150) NOT NULL,
    "company_cnpj" VARCHAR(14) NOT NULL,
    "company_website" VARCHAR(255),
    "estimated_value" DECIMAL(12,2),
    "source" "lead_source" NOT NULL,
    "notes" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(100),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "leads_email_key" ON "leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "leads_company_cnpj_key" ON "leads"("company_cnpj");

-- CreateIndex
CREATE INDEX "leads_company_cnpj_idx" ON "leads"("company_cnpj");
