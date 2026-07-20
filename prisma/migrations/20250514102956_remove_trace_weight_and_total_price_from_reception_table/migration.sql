/*
  Warnings:

  - You are about to drop the column `tare_weight` on the `Reception` table. All the data in the column will be lost.
  - You are about to drop the column `total_price` on the `Reception` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reception` DROP COLUMN `tare_weight`,
    DROP COLUMN `total_price`;
