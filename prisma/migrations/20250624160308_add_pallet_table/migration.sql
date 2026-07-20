/*
  Warnings:

  - You are about to drop the column `pallet_number` on the `Shipping_weight_fish` table. All the data in the column will be lost.
  - Added the required column `pallet_id` to the `Shipping_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Shipping_weight_fish` DROP COLUMN `pallet_number`,
    ADD COLUMN `pallet_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Pallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_id` INTEGER NOT NULL,
    `pallet_number` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Pallet_shipping_id_pallet_number_key`(`shipping_id`, `pallet_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Pallet` ADD CONSTRAINT `Pallet_shipping_id_fkey` FOREIGN KEY (`shipping_id`) REFERENCES `Shipping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_pallet_id_fkey` FOREIGN KEY (`pallet_id`) REFERENCES `Pallet`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
