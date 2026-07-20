-- AlterTable
ALTER TABLE `Wrapping` ADD COLUMN `isFinished` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `isValid` BOOLEAN NOT NULL DEFAULT false;
