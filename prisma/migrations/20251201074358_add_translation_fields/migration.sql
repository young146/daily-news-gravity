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
    "isPublishedMain" BOOLEAN NOT NULL DEFAULT false,
    "isPublishedDaily" BOOLEAN NOT NULL DEFAULT false,
    "isSentSNS" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_NewsItem" ("category", "content", "createdAt", "id", "imageUrl", "originalUrl", "publishedAt", "source", "status", "summary", "title", "updatedAt") SELECT "category", "content", "createdAt", "id", "imageUrl", "originalUrl", "publishedAt", "source", "status", "summary", "title", "updatedAt" FROM "NewsItem";
DROP TABLE "NewsItem";
ALTER TABLE "new_NewsItem" RENAME TO "NewsItem";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
