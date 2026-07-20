/*
  Warnings:

  - You are about to drop the column `untraced_price_kg` on the `Reception_pricing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reception` ADD COLUMN `untraced_price_kg` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Reception_pricing` DROP COLUMN `untraced_price_kg`;
