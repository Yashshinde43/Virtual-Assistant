import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error while connecting to DB:", error.message);
    throw error; // <-- important to prevent server from starting
  }
};

export default connectDB;
