-- AlterTable
ALTER TABLE `Reception_weight_fish` ADD COLUMN `quality_id` INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `Wrapping_weight_fish` ADD COLUMN `quality_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_quality_id_fkey` FOREIGN KEY (`quality_id`) REFERENCES `Quality`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_quality_id_fkey` FOREIGN KEY (`quality_id`) REFERENCES `Quality`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
