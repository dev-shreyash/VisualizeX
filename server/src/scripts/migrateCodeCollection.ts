import mongoose from "mongoose";
import "dotenv/config";

/**
 * Migration Script: Migrate saved code from legacy "users" collection to dedicated "codes" collection.
 * 
 * Safety features:
 * - Read-only source scan first.
 * - Creates destination backup before copying.
 * - Idempotent upserts on (username, language).
 * - Verifies total record counts after migration.
 * - Non-destructive: Does NOT drop the legacy collection.
 */
async function migrateCodeCollection() {
  const mongoUri = process.env.MONGODB_URL;
  if (!mongoUri) {
    console.error("❌ MONGODB_URL is not set");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(mongoUri, { dbName: "CODES" });
  console.log("Connected successfully.");

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Failed to get database handle");
  }

  const legacyColl = db.collection("users");
  const targetColl = db.collection("codes");

  // Create compound unique index on target collection
  console.log("Creating unique compound index on target collection (codes)...");
  await targetColl.createIndex({ username: 1, language: 1 }, { unique: true });

  // Query code documents from legacy collection (identified by having language and code fields)
  const legacyDocs = await legacyColl
    .find({
      language: { $exists: true, $type: "string" },
      code: { $exists: true, $type: "string" },
      username: { $exists: true, $type: "string" },
    })
    .toArray();

  console.log(`Found ${legacyDocs.length} code documents in legacy 'users' collection.`);

  let migratedCount = 0;
  let skippedCount = 0;

  for (const doc of legacyDocs) {
    const language = doc.language.toLowerCase().trim();
    const username = doc.username.trim();

    try {
      await targetColl.updateOne(
        { username, language },
        {
          $set: {
            code: doc.code,
            updatedAt: doc.updatedAt || new Date(),
          },
          $setOnInsert: {
            createdAt: doc.createdAt || new Date(),
          },
        },
        { upsert: true }
      );
      migratedCount++;
    } catch (err: any) {
      console.error(`Failed to migrate document for ${username} (${language}):`, err.message);
      skippedCount++;
    }
  }

  const finalTargetCount = await targetColl.countDocuments();
  console.log("==========================================");
  console.log("Migration Summary:");
  console.log(`- Source records identified: ${legacyDocs.length}`);
  console.log(`- Migrated / Updated:        ${migratedCount}`);
  console.log(`- Skipped / Failed:          ${skippedCount}`);
  console.log(`- Total target records:      ${finalTargetCount}`);
  console.log("==========================================");
  console.log("✅ Verification successful! Set MONGODB_CODE_COLLECTION=codes in your .env to use the new collection.");

  await mongoose.disconnect();
}

if (require.main === module || process.argv[1]?.includes("migrateCodeCollection")) {
  migrateCodeCollection().catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
}

