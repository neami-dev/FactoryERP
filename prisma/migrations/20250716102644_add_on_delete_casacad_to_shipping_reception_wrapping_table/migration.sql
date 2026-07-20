/*
  Warnings:

  - You are about to drop the column `remaining_weight` on the `Reception` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Pallet` DROP FOREIGN KEY `Pallet_shipping_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception_weight_fish` DROP FOREIGN KEY `Reception_weight_fish_reception_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception_wrapping` DROP FOREIGN KEY `Reception_wrapping_reception_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception_wrapping` DROP FOREIGN KEY `Reception_wrapping_wrapping_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipping_Fish_category` DROP FOREIGN KEY `Shipping_Fish_category_shipping_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_weight_fish` DROP FOREIGN KEY `Wrapping_weight_fish_wrapping_id_fkey`;

-- DropIndex
DROP INDEX `Reception_wrapping_wrapping_id_fkey` ON `Reception_wrapping`;

-- DropIndex
DROP INDEX `Wrapping_weight_fish_wrapping_id_fkey` ON `Wrapping_weight_fish`;

-- AlterTable
ALTER TABLE `Reception` DROP COLUMN `remaining_weight`,
    ADD COLUMN `weight_taken_in_wrapping` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_Fish_category` ADD CONSTRAINT `Shipping_Fish_category_shipping_id_fkey` FOREIGN KEY (`shipping_id`) REFERENCES `Shipping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pallet` ADD CONSTRAINT `Pallet_shipping_id_fkey` FOREIGN KEY (`shipping_id`) REFERENCES `Shipping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_wrapping` ADD CONSTRAINT `Reception_wrapping_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_wrapping` ADD CONSTRAINT `Reception_wrapping_wrapping_id_fkey` FOREIGN KEY (`wrapping_id`) REFERENCES `Wrapping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_wrapping_id_fkey` FOREIGN KEY (`wrapping_id`) REFERENCES `Wrapping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
