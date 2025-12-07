/*
  Warnings:

  - Changed the type of `budgetRange` on the `TravelPlan` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "TravelPlan" DROP COLUMN "budgetRange",
ADD COLUMN     "budgetRange" INTEGER NOT NULL;
