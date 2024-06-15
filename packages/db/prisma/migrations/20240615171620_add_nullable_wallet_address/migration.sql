/*
  Warnings:

  - You are about to drop the `OrgWallet` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserWallet` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrgWallet" DROP CONSTRAINT "OrgWallet_orgId_fkey";

-- DropForeignKey
ALTER TABLE "UserWallet" DROP CONSTRAINT "UserWallet_userId_fkey";

-- AlterTable
ALTER TABLE "Org" ADD COLUMN     "walletAddress" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "walletAddress" TEXT;

-- DropTable
DROP TABLE "OrgWallet";

-- DropTable
DROP TABLE "UserWallet";
