-- CreateTable
CREATE TABLE "Book" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'to-read',

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);
