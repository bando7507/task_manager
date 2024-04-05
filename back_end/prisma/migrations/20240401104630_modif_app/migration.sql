/*
  Warnings:

  - Added the required column `codecoleur` to the `TaskList` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `tasklist` ADD COLUMN `codecoleur` VARCHAR(191) NOT NULL;
