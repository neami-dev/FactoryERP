/*
  Warnings:

  - Made the column `img` on table `Fish_category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Fish_category` MODIFY `img` LONGBLOB NOT NULL;
