/*
  Warnings:

  - You are about to drop the column `stripeCheckoutId` on the `Checkout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Checkout` DROP COLUMN `stripeCheckoutId`,
    ADD COLUMN `stripePaymentIntentId` VARCHAR(191) NULL;
