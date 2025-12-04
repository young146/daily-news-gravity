-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_NewsItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" TEXT,
    "originalUrl" TEXT,
    "imageUrl" TEXT,
    "category" TEXT NOT NULL,
    "source" TEXT,
    "translatedTitle" TEXT,
    "translatedSummary" TEXT,
    "translatedContent" TEXT,
    "translationStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "isPublishedMain" BOOLEAN NOT NULL DEFAULT false,
    "isPublishedDaily" BOOLEAN NOT NULL DEFAULT false,
    "isSentSNS" BOOLEAN NOT NULL DEFAULT false,
    "htmlContent" TEXT,
    "publishedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_NewsItem" ("category", "content", "createdAt", "id", "imageUrl", "isPublishedDaily", "isPublishedMain", "isSentSNS", "originalUrl", "publishedAt", "source", "status", "summary", "title", "translatedContent", "translatedSummary", "translatedTitle", "updatedAt") SELECT "category", "content", "createdAt", "id", "imageUrl", "isPublishedDaily", "isPublishedMain", "isSentSNS", "originalUrl", "publishedAt", "source", "status", "summary", "title", "translatedContent", "translatedSummary", "translatedTitle", "updatedAt" FROM "NewsItem";
DROP TABLE "NewsItem";
ALTER TABLE "new_NewsItem" RENAME TO "NewsItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
