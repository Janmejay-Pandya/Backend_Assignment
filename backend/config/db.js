import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
    
    // Remove any unwanted indexes from tasks collection (e.g., email index)
    try {
      const db = mongoose.connection.db;
      const tasksCollection = db.collection("tasks");
      const indexes = await tasksCollection.indexes();
      
      // Find and drop email-related indexes
      for (const index of indexes) {
        if (index.key && index.key.email !== undefined) {
          await tasksCollection.dropIndex(index.name);
          console.log(`Dropped unwanted index: ${index.name} from tasks collection`);
        }
      }
    } catch (indexErr) {
      // Ignore errors if index doesn't exist or collection doesn't exist yet
      console.log("Index cleanup completed (or no cleanup needed)");
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
