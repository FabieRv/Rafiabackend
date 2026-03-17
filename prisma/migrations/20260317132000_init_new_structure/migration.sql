-- CreateTable
CREATE TABLE `User` (
    `id_user` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `adress` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('ADMIN', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id_user`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Type` (
    `id_type` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_type` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `date_creation_type` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Type_nom_type_key`(`nom_type`),
    PRIMARY KEY (`id_type`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Category` (
    `id_categorie` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_categorie` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `id_type` INTEGER NOT NULL,

    UNIQUE INDEX `Category_nom_categorie_key`(`nom_categorie`),
    PRIMARY KEY (`id_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SousCategory` (
    `id_sous_categorie` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_sous_categorie` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `date_creation` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `id_categorie` INTEGER NOT NULL,

    UNIQUE INDEX `SousCategory_nom_sous_categorie_key`(`nom_sous_categorie`),
    PRIMARY KEY (`id_sous_categorie`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Catalogue` (
    `id_catalogue` INTEGER NOT NULL AUTO_INCREMENT,
    `nom_catalogue` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `date_creation` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `statut` ENUM('ACTIF', 'INACTIF', 'EN_ATTENTE') NOT NULL DEFAULT 'EN_ATTENTE',
    `id_user` INTEGER NOT NULL,

    PRIMARY KEY (`id_catalogue`)
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
    `id_catalogue` INTEGER NOT NULL,
    `id_sous_categorie` INTEGER NOT NULL,

    PRIMARY KEY (`id_produit`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Category` ADD CONSTRAINT `Category_id_type_fkey` FOREIGN KEY (`id_type`) REFERENCES `Type`(`id_type`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SousCategory` ADD CONSTRAINT `SousCategory_id_categorie_fkey` FOREIGN KEY (`id_categorie`) REFERENCES `Category`(`id_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Catalogue` ADD CONSTRAINT `Catalogue_id_user_fkey` FOREIGN KEY (`id_user`) REFERENCES `User`(`id_user`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_id_catalogue_fkey` FOREIGN KEY (`id_catalogue`) REFERENCES `Catalogue`(`id_catalogue`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_id_sous_categorie_fkey` FOREIGN KEY (`id_sous_categorie`) REFERENCES `SousCategory`(`id_sous_categorie`) ON DELETE RESTRICT ON UPDATE CASCADE;
