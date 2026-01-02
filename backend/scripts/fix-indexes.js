import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const fixIndexes = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;
    const tasksCollection = db.collection("tasks");
    
    // Get all indexes
    const indexes = await tasksCollection.indexes();
    console.log("Current indexes:", indexes.map(idx => idx.name));

    // Drop email-related indexes
    for (const index of indexes) {
      if (index.key && index.key.email !== undefined) {
        try {
          await tasksCollection.dropIndex(index.name);
          console.log(`✅ Dropped index: ${index.name}`);
        } catch (err) {
          console.log(`⚠️  Could not drop index ${index.name}:`, err.message);
        }
      }
    }

    console.log("✅ Index cleanup completed!");
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err);
    process.exit(1);
  }
};

fixIndexes();

