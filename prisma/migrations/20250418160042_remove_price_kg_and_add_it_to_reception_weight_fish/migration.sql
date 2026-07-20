/*
  Warnings:

  - You are about to drop the column `price_kg` on the `Reception` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reception` DROP COLUMN `price_kg`;

-- AlterTable
ALTER TABLE `Reception_weight_fish` ADD COLUMN `price_kg` DOUBLE NULL;
