-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "manuallyReview" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewedAt" TIMESTAMP(0),
ADD COLUMN     "reviewedBy" TEXT;
