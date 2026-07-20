/*
  Warnings:

  - You are about to drop the column `price_kg` on the `Reception_weight_fish` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Reception_weight_fish` DROP FOREIGN KEY `Reception_weight_fish_reception_id_fkey`;

-- AlterTable
ALTER TABLE `Reception_weight_fish` DROP COLUMN `price_kg`;

-- CreateTable
CREATE TABLE `Reception_pricing` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weight_type_id` INTEGER NOT NULL,
    `reception_id` INTEGER NOT NULL,
    `price_kg` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `Idx_reception_id`(`reception_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `Idx_name` ON `Fish_category`(`name`);

-- CreateIndex
CREATE INDEX `Idx_fish_category_id` ON `Weight_type`(`fish_category_id`);

-- CreateIndex
CREATE INDEX `Idx_name` ON `Weight_type`(`name`);

-- AddForeignKey
ALTER TABLE `Reception_pricing` ADD CONSTRAINT `Reception_pricing_weight_type_id_fkey` FOREIGN KEY (`weight_type_id`) REFERENCES `Weight_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_pricing` ADD CONSTRAINT `Reception_pricing_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `Invoice` RENAME INDEX `Invoice_reception_id_fkey` TO `Idx_reception_id`;

-- RenameIndex
ALTER TABLE `Reception_weight_fish` RENAME INDEX `Reception_weight_fish_reception_id_fkey` TO `Idx_reception_id`;

-- RenameIndex
ALTER TABLE `Reception_weight_fish` RENAME INDEX `Reception_weight_fish_weight_type_id_fkey` TO `Idx_weight_type_id`;
