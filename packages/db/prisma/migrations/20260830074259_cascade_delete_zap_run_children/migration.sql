-- DropForeignKey
ALTER TABLE "ZapRunExecution" DROP CONSTRAINT "ZapRunExecution_zapRunId_fkey";

-- DropForeignKey
ALTER TABLE "ZapRunOutBox" DROP CONSTRAINT "ZapRunOutBox_zapRunId_fkey";

-- AddForeignKey
ALTER TABLE "ZapRunExecution" ADD CONSTRAINT "ZapRunExecution_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "ZapRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ZapRunOutBox" ADD CONSTRAINT "ZapRunOutBox_zapRunId_fkey" FOREIGN KEY ("zapRunId") REFERENCES "ZapRun"("id") ON DELETE CASCADE ON UPDATE CASCADE;
