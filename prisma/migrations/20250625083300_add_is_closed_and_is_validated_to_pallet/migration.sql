-- AlterTable
ALTER TABLE `Pallet` ADD COLUMN `is_closed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_validated` BOOLEAN NOT NULL DEFAULT false;
