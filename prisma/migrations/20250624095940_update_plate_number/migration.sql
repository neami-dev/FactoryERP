-- CreateTable
CREATE TABLE `Shipping` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` INTEGER NOT NULL,
    `weigher_id` INTEGER NOT NULL,
    `plate_number` VARCHAR(191) NOT NULL,
    `isValid` BOOLEAN NOT NULL DEFAULT false,
    `isFinished` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipping_Fish_category` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_id` INTEGER NOT NULL,
    `fish_category_id` INTEGER NOT NULL,

    UNIQUE INDEX `Shipping_Fish_category_shipping_id_fish_category_id_key`(`shipping_id`, `fish_category_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Shipping_weight_fish` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `shipping_Fish_category_id` INTEGER NOT NULL,
    `wrapping_weight_type_id` INTEGER NOT NULL,
    `pallet_number` INTEGER NOT NULL,
    `weight` DOUBLE NOT NULL,
    `box` INTEGER NOT NULL,
    `box_type` ENUM('CELLOPHANE', 'CARTON') NOT NULL,
    `wrapping_type` ENUM('BLOCK', 'IQF') NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    UNIQUE INDEX `Shipping_weight_fish_pallet_number_key`(`pallet_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_weigher_id_fkey` FOREIGN KEY (`weigher_id`) REFERENCES `Weigher`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping` ADD CONSTRAINT `Shipping_client_id_fkey` FOREIGN KEY (`client_id`) REFERENCES `Client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_Fish_category` ADD CONSTRAINT `Shipping_Fish_category_shipping_id_fkey` FOREIGN KEY (`shipping_id`) REFERENCES `Shipping`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_Fish_category` ADD CONSTRAINT `Shipping_Fish_category_fish_category_id_fkey` FOREIGN KEY (`fish_category_id`) REFERENCES `Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_shipping_Fish_category_id_fkey` FOREIGN KEY (`shipping_Fish_category_id`) REFERENCES `Shipping_Fish_category`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Shipping_weight_fish` ADD CONSTRAINT `Shipping_weight_fish_wrapping_weight_type_id_fkey` FOREIGN KEY (`wrapping_weight_type_id`) REFERENCES `Wrapping_weight_type`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
