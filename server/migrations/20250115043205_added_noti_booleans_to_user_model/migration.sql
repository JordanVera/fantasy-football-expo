-- AlterTable
ALTER TABLE `User` ADD COLUMN `pickReminders` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `pushNotifications` BOOLEAN NOT NULL DEFAULT true;
