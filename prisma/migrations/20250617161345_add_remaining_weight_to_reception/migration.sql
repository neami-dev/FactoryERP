/*
  Warnings:

  - You are about to drop the column `wrapped_weight` on the `Reception` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Reception` DROP COLUMN `wrapped_weight`,
    ADD COLUMN `remaining_weight` INTEGER NULL;
