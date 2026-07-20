-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_reception_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception_weight_fish` DROP FOREIGN KEY `Reception_weight_fish_reception_id_fkey`;

-- DropIndex
DROP INDEX `Invoice_reception_id_fkey` ON `Invoice`;

-- DropIndex
DROP INDEX `Reception_weight_fish_reception_id_fkey` ON `Reception_weight_fish`;

-- AlterTable
ALTER TABLE `Reception` ADD COLUMN `tare_weight` INTEGER NOT NULL DEFAULT 2;

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Invoice` ADD CONSTRAINT `Invoice_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
