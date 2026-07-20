-- DropForeignKey
ALTER TABLE `Supplier` DROP FOREIGN KEY `Supplier_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `Weigher` DROP FOREIGN KEY `Weigher_person_id_fkey`;

-- AddForeignKey
ALTER TABLE `Weigher` ADD CONSTRAINT `Weigher_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Supplier` ADD CONSTRAINT `Supplier_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
