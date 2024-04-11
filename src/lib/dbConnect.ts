import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

//to check if the connection is already there
const connection: ConnectionObject = {};

export async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to the database!");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string);
    connection.isConnected = db.connections[0].readyState;
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}
