import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URL!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("MongoDb Connected");
    });
    connection.on("error", (error) => {
      console.log("MongoDB connection error " + error);
      process.exit(1);
    });
  } catch (error) {
    console.log("Something went wrong on Database Connect ");
    console.log(error);
  }
}
