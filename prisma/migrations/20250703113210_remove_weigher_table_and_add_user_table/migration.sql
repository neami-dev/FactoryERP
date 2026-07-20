/*
  Warnings:

  - You are about to drop the column `auth_allowed` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `Person` table. All the data in the column will be lost.
  - You are about to drop the `Weigher` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Person` DROP FOREIGN KEY `Person_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception` DROP FOREIGN KEY `Reception_weigher_id_fkey`;

-- DropForeignKey
ALTER TABLE `Shipping` DROP FOREIGN KEY `Shipping_weigher_id_fkey`;

-- DropForeignKey
ALTER TABLE `Weigher` DROP FOREIGN KEY `Weigher_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `Wrapping` DROP FOREIGN KEY `Wrapping_weigher_id_fkey`;

-- DropIndex
DROP INDEX `Person_email_key` ON `Person`;

-- DropIndex
DROP INDEX `Person_role_id_fkey` ON `Person`;

-- DropIndex
DROP INDEX `Person_username_key` ON `Person`;

-- DropIndex
DROP INDEX `Shipping_weigher_id_fkey` ON `Shipping`;

-- DropIndex
DROP INDEX `Wrapping_weigher_id_fkey` ON `Wrapping`;

-- AlterTable
ALTER TABLE `Person` DROP COLUMN `auth_allowed`,
    DROP COLUMN `email`,
    DROP COLUMN `password`,
    DROP COLUMN `role_id`,
    DROP COLUMN `username`;

-- DropTable
DROP TABLE `Weigher`;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `person_id` INTEGER NOT NULL,
    `role_id` INTEGER NOT NULL,
    `auth_allowed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_person_id_key`(`person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping` ADD CONSTRAINT `Wrapping_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `Person`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
