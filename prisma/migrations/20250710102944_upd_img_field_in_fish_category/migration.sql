/*
  Warnings:

  - You are about to drop the column `img_url` on the `Fish_category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Fish_category` DROP COLUMN `img_url`,
    ADD COLUMN `img` LONGBLOB NULL;
