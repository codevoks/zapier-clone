/*
  Warnings:

  - Added the required column `image` to the `AvaialableAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `AvaialableAction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image` to the `AvailableTrigger` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `AvailableTrigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AvaialableAction" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AvailableTrigger" ADD COLUMN     "image" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
