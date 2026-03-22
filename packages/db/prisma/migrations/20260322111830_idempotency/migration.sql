-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PROCESSING', 'SUCCESS', 'FAIL');

-- CreateTable
CREATE TABLE "ZapRunExecution" (
    "id" TEXT NOT NULL,
    "zapRunId" TEXT NOT NULL,
    "stepOrder" INTEGER NOT NULL,
    "status" "Status" NOT NULL,
    "message" TEXT,

    CONSTRAINT "ZapRunExecution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ZapRunExecution_zapRunId_stepOrder_key" ON "ZapRunExecution"("zapRunId", "stepOrder");

-- AddForeignKey
ALTER TABLE "ZapRunExecution" ADD CONSTRAINT "ZapRunExecution_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "ZapRun"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
