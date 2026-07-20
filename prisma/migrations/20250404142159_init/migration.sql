/*
  Warnings:

  - You are about to drop the column `type` on the `Wrapping_fish_taco` table. All the data in the column will be lost.
  - Added the required column `taco_type` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Wrapping_fish_taco` DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `Wrapping_weight_fish` ADD COLUMN `taco_type` ENUM('a', 'b', 'x') NOT NULL;
