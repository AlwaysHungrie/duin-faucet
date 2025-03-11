-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "attestationHash" TEXT,
ADD COLUMN     "executed" BOOLEAN NOT NULL DEFAULT false;
