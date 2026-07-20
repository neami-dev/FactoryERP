/*
  Warnings:

  - You are about to drop the column `adresse` on the `Person` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Person` DROP COLUMN `adresse`,
    ADD COLUMN `adress` VARCHAR(191) NULL;
