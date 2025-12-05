/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TravelType" AS ENUM ('SOLO', 'FAMILY', 'FRIENDS');

-- CreateEnum
CREATE TYPE "TravelInterest" AS ENUM ('ADVENTURE', 'HIKING', 'FOOD_TOURS', 'PHOTOGRAPHY', 'BEACHES', 'CITY_EXPLORATION', 'HISTORY', 'ART_CULTURE', 'WILDLIFE', 'NIGHTLIFE');

-- CreateEnum
CREATE TYPE "Country" AS ENUM ('USA', 'CANADA', 'UNITED_KINGDOM', 'FRANCE', 'ITALY', 'SPAIN', 'GERMANY', 'NETHERLANDS', 'SWITZERLAND', 'AUSTRALIA', 'NEW_ZEALAND', 'JAPAN', 'SOUTH_KOREA', 'THAILAND', 'SINGAPORE', 'MALAYSIA', 'UAE', 'TURKEY', 'INDONESIA', 'MALDIVES', 'INDIA', 'CHINA', 'VIETNAM', 'PHILIPPINES', 'EGYPT', 'BRAZIL', 'SOUTH_AFRICA', 'MEXICO', 'PORTUGAL', 'GREECE');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentLocation" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "profilePhoto" TEXT,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "travelInterests" "TravelInterest"[] DEFAULT ARRAY[]::"TravelInterest"[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "visitedCountries" "Country"[] DEFAULT ARRAY[]::"Country"[];

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
