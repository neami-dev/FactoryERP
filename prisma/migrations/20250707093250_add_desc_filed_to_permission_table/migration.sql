-- AlterTable
ALTER TABLE `Permission` ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `is_active` BOOLEAN NOT NULL DEFAULT true;
