/*
  Warnings:

  - You are about to drop the column `Wrapping_fish_taco_id` on the `Wrapping_weight_fish` table. All the data in the column will be lost.
  - Added the required column `wrapping_fish_taco_id` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Wrapping_weight_fish` DROP FOREIGN KEY `Wrapping_weight_fish_Wrapping_fish_taco_id_fkey`;

-- DropIndex
DROP INDEX `Wrapping_weight_fish_Wrapping_fish_taco_id_fkey` ON `Wrapping_weight_fish`;

-- AlterTable
ALTER TABLE `Wrapping_weight_fish` DROP COLUMN `Wrapping_fish_taco_id`,
    ADD COLUMN `wrapping_fish_taco_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `Wrapping_weight_fish_Wrapping_fish_taco_id_fkey` ON `Wrapping_weight_fish`(`wrapping_fish_taco_id`);

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_wrapping_fish_taco_id_fkey` FOREIGN KEY (`wrapping_fish_taco_id`) REFERENCES `Wrapping_fish_taco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
