-- CreateTable
CREATE TABLE "Answer" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "correct" BOOLEAN NOT NULL,
    "questionId" INTEGER NOT NULL,

    CONSTRAINT "Answer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Answer" ADD CONSTRAINT "Answer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
