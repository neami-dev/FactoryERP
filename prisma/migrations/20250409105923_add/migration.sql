/*
  Warnings:

  - You are about to drop the column `quantity` on the `Reception_fish` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reception` ADD COLUMN `total_price` DOUBLE NULL,
    ADD COLUMN `total_weight` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Reception_fish` DROP COLUMN `quantity`,
    ADD COLUMN `crate_number` INTEGER NULL,
    ADD COLUMN `price_kg` DOUBLE NULL,
    ADD COLUMN `total_price` DOUBLE NULL,
    ADD COLUMN `total_weight` DOUBLE NULL;
