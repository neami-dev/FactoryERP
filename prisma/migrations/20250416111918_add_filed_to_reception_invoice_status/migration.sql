-- AlterTable
ALTER TABLE `Reception` ADD COLUMN `invoiceStatus` ENUM('NONE', 'HAVENOT', 'FULL') NOT NULL DEFAULT 'NONE';
