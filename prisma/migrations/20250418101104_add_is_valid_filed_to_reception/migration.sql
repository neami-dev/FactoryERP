-- AlterTable
ALTER TABLE `Reception` ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT false,
    ALTER COLUMN `tare_weight` DROP DEFAULT;

-- AlterTable
ALTER TABLE `Weight_type` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 1;
