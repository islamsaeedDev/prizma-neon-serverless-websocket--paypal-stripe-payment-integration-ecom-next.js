/*
  Warnings:

  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `rating` on the `Product` table. All the data in the column will be lost.
  - The `id` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `price` on the `Product` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(12,2)`.

*/
-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
DROP COLUMN "rating",
ADD COLUMN     "ratting" DECIMAL(3,2) NOT NULL DEFAULT 0,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ALTER COLUMN "price" SET DEFAULT 0,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "numReviews" SET DEFAULT 0,
ALTER COLUMN "numReviews" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP(6),
ALTER COLUMN "updatedAt" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");

-- RenameIndex
ALTER INDEX "Product_slug_key" RENAME TO "product_slug_idex";
