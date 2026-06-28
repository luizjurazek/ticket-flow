/*
  Warnings:

  - The `status` column on the `Ticket` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `channel` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `priority` on the `Ticket` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('open', 'closed', 'in_progress');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "TicketChannel" AS ENUM ('ombudsman', 'customer_service', 'technical_support', 'finance', 'out_of_scope');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "channel",
ADD COLUMN     "channel" "TicketChannel" NOT NULL,
DROP COLUMN "priority",
ADD COLUMN     "priority" "TicketPriority" NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "TicketStatus" NOT NULL DEFAULT 'open';
