/*
  Warnings:

  - You are about to drop the column `crate_number` on the `Reception` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reception` DROP COLUMN `crate_number`,
    ALTER COLUMN `tare_weight` DROP DEFAULT;
