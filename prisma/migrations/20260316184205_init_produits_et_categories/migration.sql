-- AlterTable
ALTER TABLE `user` MODIFY `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `Category` (
    `id_categorie` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_categorie` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `Category_nom_categorie_key`(`nom_categorie`),
    PRIMARY KEY (`id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Product` (
    `id_produit` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_produit` VARCHAR(191) NOT NULL,
    `description` TEXT NOT NULL,
    `prix` DECIMAL(10, 2) NOT NULL,
    `quantite_stock` INTEGER NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `date_ajout` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `id_categorie` INTEGER NOT NULL,

    PRIMARY KEY (`id_produit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_id_categorie_fkey` FOREIGN KEY (`id_categorie`) REFERENCES `Category`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE;
