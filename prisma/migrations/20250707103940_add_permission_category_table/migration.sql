/*
  Warnings:

  - You are about to drop the column `category` on the `Permission` table. All the data in the column will be lost.
  - Added the required column `category_id` to the `Permission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Permission` DROP COLUMN `category`,
    ADD COLUMN `category_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Permission_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Permission_category_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Permission` ADD CONSTRAINT `Permission_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `Permission_category`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
