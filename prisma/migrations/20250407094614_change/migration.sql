-- AlterTable
ALTER TABLE `Admin` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Fish_category` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Person` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Reception` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Reception_fish` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Reception_weight_fish` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Supplier` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Weigher` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Weight_type` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Wrapping` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Wrapping_fish` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Wrapping_fish_taco` MODIFY `updated_at` DATETIME(3) NULL;

-- AlterTable
ALTER TABLE `Wrapping_weight_fish` MODIFY `updated_at` DATETIME(3) NULL;
