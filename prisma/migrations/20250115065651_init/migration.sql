-- CreateTable
CREATE TABLE "Streaks" (
    "id" SERIAL NOT NULL,
    "count" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Streaks_pkey" PRIMARY KEY ("id")
);
