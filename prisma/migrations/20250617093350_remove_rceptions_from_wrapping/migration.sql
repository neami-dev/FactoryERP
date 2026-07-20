/*
  Warnings:

  - You are about to drop the `_ReceptionToWrapping` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ReceptionToWrapping` DROP FOREIGN KEY `_ReceptionToWrapping_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ReceptionToWrapping` DROP FOREIGN KEY `_ReceptionToWrapping_B_fkey`;

-- DropTable
DROP TABLE `_ReceptionToWrapping`;
