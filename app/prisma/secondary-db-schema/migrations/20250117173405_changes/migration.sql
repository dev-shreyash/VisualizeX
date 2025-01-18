/*
  Warnings:

  - You are about to drop the column `code` on the `Algorithm` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `Algorithm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Algorithm" DROP COLUMN "code",
DROP COLUMN "language";

-- CreateTable
CREATE TABLE "AlgorithmCode" (
    "id" SERIAL NOT NULL,
    "language" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "algorithmId" INTEGER NOT NULL,

    CONSTRAINT "AlgorithmCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlgorithmCode" ADD CONSTRAINT "AlgorithmCode_algorithmId_fkey" FOREIGN KEY ("algorithmId") REFERENCES "Algorithm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
