CREATE TABLE "EmailSettings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "primaryNotificationEmail" TEXT NOT NULL DEFAULT 'contact@art-visions.fr',
    "additionalRecipients" TEXT NOT NULL DEFAULT '[]',
    "clientConfirmationEnabled" BOOLEAN NOT NULL DEFAULT true,
    "enabledTypes" TEXT NOT NULL DEFAULT '[]',
    "replyToVisitor" BOOLEAN NOT NULL DEFAULT true,
    "senderName" TEXT NOT NULL DEFAULT 'Art Vision',
    "senderEmail" TEXT NOT NULL DEFAULT 'contact@art-visions.fr',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE TABLE "EmailLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "relatedEntityType" TEXT,
    "relatedEntityId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerMessageId" TEXT,
    "errorMessageSafe" TEXT,
    "payloadJson" TEXT NOT NULL DEFAULT '{}',
    "attemptCount" INTEGER NOT NULL DEFAULT 0,
    "sentAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
CREATE INDEX "EmailLog_status_idx" ON "EmailLog"("status");
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");
CREATE INDEX "EmailLog_relatedEntityType_relatedEntityId_idx" ON "EmailLog"("relatedEntityType", "relatedEntityId");