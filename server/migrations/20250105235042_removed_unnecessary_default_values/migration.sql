-- AlterTable
ALTER TABLE `User` ALTER COLUMN `password` DROP DEFAULT,
    ALTER COLUMN `firstname` DROP DEFAULT,
    ALTER COLUMN `lastname` DROP DEFAULT,
    ALTER COLUMN `phoneNumber` DROP DEFAULT,
    ALTER COLUMN `username` DROP DEFAULT;