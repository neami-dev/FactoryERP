/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Person` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Person` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `Person` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Person` ADD COLUMN `auth_allowed` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `email` VARCHAR(191) NOT NULL,
    ADD COLUMN `password` VARCHAR(191) NOT NULL,
    ADD COLUMN `username` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Person_username_key` ON `Person`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Person_email_key` ON `Person`(`email`);
