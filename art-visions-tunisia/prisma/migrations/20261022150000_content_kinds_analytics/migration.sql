-- DropIndex
DROP INDEX "Page_slug_key";

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "category" TEXT,
ADD COLUMN     "kind" TEXT NOT NULL DEFAULT 'page',
ADD COLUMN     "translationId" TEXT;

-- CreateTable
CREATE TABLE "PageView" (
    "id" TEXT NOT NULL,
    "day" DATE NOT NULL,
    "path" TEXT NOT NULL,
    "referrer" TEXT NOT NULL DEFAULT '',
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "PageView_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PageView_day_idx" ON "PageView"("day");

-- CreateIndex
CREATE UNIQUE INDEX "PageView_day_path_referrer_key" ON "PageView"("day", "path", "referrer");

-- CreateIndex
CREATE UNIQUE INDEX "Page_kind_lang_slug_key" ON "Page"("kind", "lang", "slug");

