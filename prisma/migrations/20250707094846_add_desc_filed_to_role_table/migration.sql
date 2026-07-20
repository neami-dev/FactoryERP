-- AlterTable
ALTER TABLE `Role` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;
