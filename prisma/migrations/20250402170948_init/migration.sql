-- CreateTable
CREATE TABLE `Fish_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reception_weight_fish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reception_fish_id` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `crate` INTEGER NOT NULL,
    `weight_type_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Weight_type` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `fish_category_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reception_fish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fish_category_id` INTEGER NOT NULL,
    `reception_id` INTEGER NOT NULL,
    `quantity` DOUBLE NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Reception` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `plate_number` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `weigher_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Weigher` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wrapping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `weigher_id` INTEGER NOT NULL,
    `quantity` DOUBLE NULL,
    `box_number` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wrapping_fish_taco` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` ENUM('a', 'b', 'x') NOT NULL,
    `fish_category_id` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wrapping_fish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wrapping_id` INTEGER NOT NULL,
    `fish_category_id` INTEGER NOT NULL,
    `quantity` DOUBLE NULL,
    `box_number` INTEGER NULL,
    `wrapping_type` ENUM('BLOCK', 'QUIEF') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Wrapping_weight_fish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `wrapping_fish_id` INTEGER NOT NULL,
    `Wrapping_fish_taco_id` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `box_number` INTEGER NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_reception_fish_id_fkey` FOREIGN KEY (`reception_fish_id`) REFERENCES `Reception_fish`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_weight_fish` ADD CONSTRAINT `Reception_weight_fish_weight_type_id_fkey` FOREIGN KEY (`weight_type_id`) REFERENCES `Weight_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Weight_type` ADD CONSTRAINT `Weight_type_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_fish` ADD CONSTRAINT `Reception_fish_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception_fish` ADD CONSTRAINT `Reception_fish_reception_id_fkey` FOREIGN KEY (`reception_id`) REFERENCES `Reception`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Reception` ADD CONSTRAINT `Reception_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `Weigher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping` ADD CONSTRAINT `Wrapping_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `Weigher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_fish_taco` ADD CONSTRAINT `Wrapping_fish_taco_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_fish` ADD CONSTRAINT `Wrapping_fish_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_fish` ADD CONSTRAINT `Wrapping_fish_wrapping_id_fkey` FOREIGN KEY (`wrapping_id`) REFERENCES `Wrapping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_wrapping_fish_id_fkey` FOREIGN KEY (`wrapping_fish_id`) REFERENCES `Wrapping_fish`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Wrapping_weight_fish` ADD CONSTRAINT `Wrapping_weight_fish_Wrapping_fish_taco_id_fkey` FOREIGN KEY (`Wrapping_fish_taco_id`) REFERENCES `Wrapping_fish_taco`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
