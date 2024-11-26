/*
  Warnings:

  - A unique constraint covering the columns `[oauthProviderId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "oauthAccessToken" TEXT,
ADD COLUMN     "oauthProvider" TEXT,
ADD COLUMN     "oauthProviderId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_oauthProviderId_key" ON "User"("oauthProviderId");
