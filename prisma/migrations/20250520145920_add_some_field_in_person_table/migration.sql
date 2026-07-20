/*
  Warnings:

  - You are about to drop the column `name` on the `Person` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[person_id]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[person_id]` on the table `Supplier` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[person_id]` on the table `Weigher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `firstname` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastname` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Person` DROP COLUMN `name`,
    ADD COLUMN `adresse` VARCHAR(191) NULL,
    ADD COLUMN `date_of_birth` DATETIME(3) NULL,
    ADD COLUMN `firstname` VARCHAR(191) NOT NULL,
    ADD COLUMN `gender` ENUM('MALE', 'FEMALE') NULL,
    ADD COLUMN `lastname` VARCHAR(191) NOT NULL,
    ADD COLUMN `phone_number` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_person_id_key` ON `Admin`(`person_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Supplier_person_id_key` ON `Supplier`(`person_id`);

-- CreateIndex
CREATE UNIQUE INDEX `Weigher_person_id_key` ON `Weigher`(`person_id`);
