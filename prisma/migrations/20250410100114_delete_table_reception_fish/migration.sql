/*
  Warnings:

  - You are about to drop the column `reception_fish_id` on the `Reception_weight_fish` table. All the data in the column will be lost.
  - You are about to drop the `Reception_fish` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Fish_category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fish_category_id,name]` on the table `Weight_type` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fish_category_id` to the `Reception` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reception_id` to the `Reception_weight_fish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Reception_fish` DROP FOREIGN KEY `Reception_fish_fish_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception_fish` DROP FOREIGN KEY `Reception_fish_reception_id_fkey`;

-- DropForeignKey
ALTER TABLE `Reception_weight_fish` DROP FOREIGN KEY `Reception_weight_fish_reception_fish_id_fkey`;

-- DropIndex
DROP INDEX `Reception_weight_fish_reception_fish_id_fkey` ON `Reception_weight_fish`;

-- AlterTable
ALTER TABLE `Reception` ADD COLUMN `crate_number` INTEGER NULL,
    ADD COLUMN `fish_category_id` INTEGER NOT NULL,
    ADD COLUMN `price_kg` DOUBLE NULL;

-- AlterTable
ALTER TABLE `Reception_weight_fish` DROP COLUMN `reception_fish_id`,
    ADD COLUMN `reception_id` INTEGER NOT NULL;

-- DropTable
DROP TABLE `Reception_fish`;

-- CreateIndex
CREATE UNIQUE INDEX `Fish_category_name_key` ON `Fish_category`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Weight_type_fish_category_id_name_key` ON `Weight_type`(`fish_category_id`, `name`);

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
