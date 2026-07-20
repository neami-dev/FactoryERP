/*
  Warnings:

  - You are about to drop the column `supplier_id` on the `Invoice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Invoice` DROP FOREIGN KEY `Invoice_supplier_id_fkey`;

-- DropIndex
DROP INDEX `Invoice_supplier_id_fkey` ON `Invoice`;

-- AlterTable
ALTER TABLE `Invoice` DROP COLUMN `supplier_id`;
