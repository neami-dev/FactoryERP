/*
  Warnings:

  - You are about to drop the column `box_number` on the `Wrapping` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Wrapping` table. All the data in the column will be lost.
  - You are about to drop the column `weigher_id` on the `Wrapping` table. All the data in the column will be lost.
  - You are about to drop the column `box_number` on the `Wrapping_weight_fish` table. All the data in the column will be lost.
  - You are about to drop the column `taco_type` on the `Wrapping_weight_fish` table. All the data in the column will be lost.
  - You are about to drop the column `wrapping_fish_id` on the `Wrapping_weight_fish` table. All the data in the column will be lost.
  - You are about to drop the column `wrapping_fish_taco_id` on the `Wrapping_weight_fish` table. All the data in the column will be lost.
  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wrapping_fish` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Wrapping_fish_taco` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `client_id` to the `Wrapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fish_category_id` to the `Wrapping` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reception_id` to the `Wrapping` table without a default value. This is not possible if the table is not empty.
  - Made the column `updated_at` on table `Wrapping` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `box_type` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrapping_id` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrapping_type` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wrapping_weight_type_id` to the `Wrapping_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Admin` DROP FOREIGN KEY `Admin_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping` DROP FOREIGN KEY `Wrapping_weigher_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_fish` DROP FOREIGN KEY `Wrapping_fish_fish_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_fish` DROP FOREIGN KEY `Wrapping_fish_wrapping_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_fish_taco` DROP FOREIGN KEY `Wrapping_fish_taco_fish_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_weight_fish` DROP FOREIGN KEY `Wrapping_weight_fish_wrapping_fish_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping_weight_fish` DROP FOREIGN KEY `Wrapping_weight_fish_wrapping_fish_taco_id_fkey`;

-- DropIndex
DROP INDEX `Wrapping_weigher_id_fkey` ON `Wrapping`;

-- DropIndex
DROP INDEX `Wrapping_weight_fish_Wrapping_fish_taco_id_fkey` ON `Wrapping_weight_fish`;

-- DropIndex
DROP INDEX `Wrapping_weight_fish_wrapping_fish_id_fkey` ON `Wrapping_weight_fish`;

-- AlterTable
ALTER TABLE `Wrapping` DROP COLUMN `box_number`,
    DROP COLUMN `quantity`,
    DROP COLUMN `weigher_id`,
    ADD COLUMN `client_id` INTEGER NOT NULL,
    ADD COLUMN `fish_category_id` INTEGER NOT NULL,
    ADD COLUMN `reception_id` INTEGER NOT NULL,
    ADD COLUMN `storage_location` VARCHAR(191) NULL,
    MODIFY `updated_at` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `Wrapping_weight_fish` DROP COLUMN `box_number`,
    DROP COLUMN `taco_type`,
    DROP COLUMN `wrapping_fish_id`,
    DROP COLUMN `wrapping_fish_taco_id`,
    ADD COLUMN `box_type` ENUM('CELLOPHANE', 'CARTON') NOT NULL,
    ADD COLUMN `wrapping_id` INTEGER NOT NULL,
    ADD COLUMN `wrapping_type` ENUM('BLOCK', 'IQF') NOT NULL,
    ADD COLUMN `wrapping_weight_type_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Admin`;

-- DropTable
DROP TABLE `Wrapping_fish`;

-- DropTable
DROP TABLE `Wrapping_fish_taco`;

-- CreateTable
CREATE TABLE `Wrapping_weight_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fish_category_id` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 1,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    INDEX `Idx_fish_category_id`(`fish_category_id`),
    INDEX `Idx_name`(`name`),
    UNIQUE INDEX `Wrapping_weight_type_fish_category_id_name_key`(`fish_category_id`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `person_id` INTEGER NOT NULL,
    `client_type` ENUM('STOCK', 'BUYER', 'SUPPLIER') NOT NULL DEFAULT 'STOCK',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Client_person_id_key`(`person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reception_wrapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reception_id` INTEGER NOT NULL,
    `wrapping_id` INTEGER NOT NULL,

    UNIQUE INDEX `Reception_wrapping_reception_id_wrapping_id_key`(`reception_id`, `wrapping_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ReceptionToWrapping` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_ReceptionToWrapping_AB_unique`(`A`, `B`),
    INDEX `_ReceptionToWrapping_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_type` ADD CONSTRAINT `Wrapping_weight_type_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Client` ADD CONSTRAINT `Client_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping` ADD CONSTRAINT `Wrapping_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping` ADD CONSTRAINT `Wrapping_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_wrapping` ADD CONSTRAINT `Reception_wrapping_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_wrapping` ADD CONSTRAINT `Reception_wrapping_wrapping_id_fkey` FOREIGN KEY (`wrapping_id`) REFERENCES `Wrapping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_wrapping_id_fkey` FOREIGN KEY (`wrapping_id`) REFERENCES `Wrapping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_wrapping_weight_type_id_fkey` FOREIGN KEY (`wrapping_weight_type_id`) REFERENCES `Wrapping_weight_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReceptionToWrapping` ADD CONSTRAINT `_ReceptionToWrapping_A_fkey` FOREIGN KEY (`A`) REFERENCES `Reception`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ReceptionToWrapping` ADD CONSTRAINT `_ReceptionToWrapping_B_fkey` FOREIGN KEY (`B`) REFERENCES `Wrapping`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
