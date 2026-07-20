-- AlterTable
ALTER TABLE `Person` ADD COLUMN `soft_delete` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `soft_delete` BOOLEAN NOT NULL DEFAULT false;
