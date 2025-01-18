-- CreateTable
CREATE TABLE "Algorithm" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "steps" TEXT[],
    "keyConcepts" TEXT[],
    "worstCase" TEXT NOT NULL,
    "bestCase" TEXT NOT NULL,
    "averageCase" TEXT NOT NULL,
    "spaceComplexity" TEXT NOT NULL,
    "advantages" TEXT[],
    "disadvantages" TEXT[],
    "practicalUse" TEXT[],
    "code" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "metadataName" TEXT NOT NULL,
    "metadataDescription" TEXT NOT NULL,
    "metadataImage" TEXT NOT NULL,
    "metadataRoute" TEXT NOT NULL,

    CONSTRAINT "Algorithm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Algorithm_key_key" ON "Algorithm"("key");
