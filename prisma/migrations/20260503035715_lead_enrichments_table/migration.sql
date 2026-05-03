-- CreateEnum
CREATE TYPE "enrichment_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateTable
CREATE TABLE "lead_enrichments" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "full_name" VARCHAR(100),
    "email" VARCHAR(255),
    "phone" VARCHAR(20),
    "company_name" VARCHAR(150),
    "company_cnpj" VARCHAR(14),
    "company_website" VARCHAR(255),
    "estimated_value" DECIMAL(12,2),
    "source" "lead_source",
    "notes" VARCHAR(500),
    "status" "enrichment_status" NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "raw_data" JSONB,
    "error_message" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(100),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lead_enrichments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_enrichments_lead_id_idx" ON "lead_enrichments"("lead_id");

-- CreateIndex
CREATE INDEX "lead_enrichments_status_idx" ON "lead_enrichments"("status");

-- AddForeignKey
ALTER TABLE "lead_enrichments" ADD CONSTRAINT "lead_enrichments_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
