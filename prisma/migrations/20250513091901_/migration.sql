/*
  Warnings:

  - Made the column `img_url` on table `Fish_category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Fish_category` MODIFY `img_url` VARCHAR(191) NOT NULL;
