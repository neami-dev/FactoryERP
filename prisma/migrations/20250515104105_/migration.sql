-- DropForeignKey
ALTER TABLE `Weight_type` DROP FOREIGN KEY `Weight_type_fish_category_id_fkey`;

-- AddForeignKey
ALTER TABLE `Weight_type` ADD CONSTRAINT `Weight_type_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
