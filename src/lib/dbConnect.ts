import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.DATABASE_URL || "", {
      dbName: "anonymous",
    });

    console.log("database : ", db);
    console.log("db.connections[] : ", db.connections);

    connection.isConnected = db.connections[0].readyState;

    console.log("db connected successfully");
  } catch (error) {
    console.log("db connection failed", error);

    process.exit(1);
  }
}

export default dbConnect;
