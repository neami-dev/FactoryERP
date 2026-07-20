/*
  Warnings:

  - Added the required column `quality_id` to the `Shipping_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipping_weight_fish` ADD COLUMN `quality_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Quality` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Quality_title_key`(`title`),
    UNIQUE INDEX `Quality_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_quality_id_fkey` FOREIGN KEY (`quality_id`) REFERENCES `Quality`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
