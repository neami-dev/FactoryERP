-- DropForeignKey
ALTER TABLE `Shipping_weight_fish` DROP FOREIGN KEY `Shipping_weight_fish_pallet_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipping_weight_fish` DROP FOREIGN KEY `Shipping_weight_fish_quality_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipping_weight_fish` DROP FOREIGN KEY `Shipping_weight_fish_shipping_Fish_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_weight_fish` DROP FOREIGN KEY `Wrapping_weight_fish_quality_id_fkey`;

-- DropIndex
DROP INDEX `Shipping_weight_fish_pallet_id_fkey` ON `Shipping_weight_fish`;

-- DropIndex
DROP INDEX `Shipping_weight_fish_quality_id_fkey` ON `Shipping_weight_fish`;

-- DropIndex
DROP INDEX `Shipping_weight_fish_shipping_Fish_category_id_fkey` ON `Shipping_weight_fish`;

-- DropIndex
DROP INDEX `Wrapping_weight_fish_quality_id_fkey` ON `Wrapping_weight_fish`;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_pallet_id_fkey` FOREIGN KEY (`pallet_id`) REFERENCES `Pallet`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_shipping_Fish_category_id_fkey` FOREIGN KEY (`shipping_Fish_category_id`) REFERENCES `Shipping_Fish_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_quality_id_fkey` FOREIGN KEY (`quality_id`) REFERENCES `Quality`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_quality_id_fkey` FOREIGN KEY (`quality_id`) REFERENCES `Quality`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
