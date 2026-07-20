-- AlterTable
ALTER TABLE `Wrapping` ADD COLUMN `weigher_id` INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE `Wrapping` ADD CONSTRAINT `Wrapping_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `Weigher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
