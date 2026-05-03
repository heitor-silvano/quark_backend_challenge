-- CreateEnum
CREATE TYPE "classification_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "classification_label" AS ENUM ('Hot', 'Warm', 'Cold');

-- CreateEnum
CREATE TYPE "commercial_potential" AS ENUM ('High', 'Medium', 'Low');

-- CreateTable
CREATE TABLE "lead_classifications" (
    "id" TEXT NOT NULL,
    "lead_id" TEXT NOT NULL,
    "score" INTEGER,
    "classification" "classification_label",
    "justification" VARCHAR(500),
    "commercial_potential" "commercial_potential",
    "model_used" VARCHAR(100),
    "status" "classification_status" NOT NULL,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "error_message" VARCHAR(500),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" VARCHAR(100),
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by" VARCHAR(100),
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "lead_classifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "lead_classifications_lead_id_idx" ON "lead_classifications"("lead_id");

-- CreateIndex
CREATE INDEX "lead_classifications_status_idx" ON "lead_classifications"("status");

-- AddForeignKey
ALTER TABLE "lead_classifications" ADD CONSTRAINT "lead_classifications_lead_id_fkey" FOREIGN KEY ("lead_id") REFERENCES "leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
