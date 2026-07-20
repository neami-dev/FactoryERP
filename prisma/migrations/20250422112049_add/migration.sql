/*
  Warnings:

  - You are about to drop the column `weight_type_id` on the `Reception_pricing` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[reception_id,weight_type_name]` on the table `Reception_pricing` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `untraced_price_kg` to the `Reception_pricing` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight_type_name` to the `Reception_pricing` table without a default value. This is not possible if the table is not empty.
  - Made the column `price_kg` on table `Reception_pricing` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `Reception_pricing` DROP FOREIGN KEY `Reception_pricing_weight_type_id_fkey`;

-- DropIndex
DROP INDEX `Reception_pricing_weight_type_id_fkey` ON `Reception_pricing`;

-- AlterTable
ALTER TABLE `Reception_pricing` DROP COLUMN `weight_type_id`,
    ADD COLUMN `untraced_price_kg` DOUBLE NOT NULL,
    ADD COLUMN `weight_type_name` VARCHAR(191) NOT NULL,
    MODIFY `price_kg` DOUBLE NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Reception_pricing_reception_id_weight_type_name_key` ON `Reception_pricing`(`reception_id`, `weight_type_name`);
