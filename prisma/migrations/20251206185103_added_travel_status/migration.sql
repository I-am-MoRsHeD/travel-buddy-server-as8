/*
  Warnings:

  - You are about to drop the column `travel_id` on the `Review` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "TravelStatus" AS ENUM ('UPCOMING', 'ONGOING', 'COMPLETED', 'POSTPONED');

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "travel_id";

-- AlterTable
ALTER TABLE "TravelPlan" ADD COLUMN     "travelStatus" "TravelStatus" NOT NULL DEFAULT 'UPCOMING';
