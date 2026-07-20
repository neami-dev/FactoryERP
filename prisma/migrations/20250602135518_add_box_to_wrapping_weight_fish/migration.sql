/*
  Warnings:

  - Added the required column `box` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Wrapping_weight_fish` ADD COLUMN `box` INTEGER NOT NULL;
