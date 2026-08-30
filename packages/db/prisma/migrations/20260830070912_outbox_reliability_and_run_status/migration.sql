-- AlterTable
ALTER TABLE "ZapRun" ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "error" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3),
ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'PROCESSING';

-- AlterTable
ALTER TABLE "ZapRunOutBox" ADD COLUMN     "attempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deadLetteredAt" TIMESTAMP(3),
ADD COLUMN     "lastError" TEXT,
ADD COLUMN     "lockedAt" TIMESTAMP(3),
ADD COLUMN     "nextAttemptAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE INDEX "ZapRun_zapId_createdAt_idx" ON "ZapRun"("zapId", "createdAt");

-- CreateIndex
CREATE INDEX "ZapRunOutBox_deadLetteredAt_nextAttemptAt_idx" ON "ZapRunOutBox"("deadLetteredAt", "nextAttemptAt");
