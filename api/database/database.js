import mongoose from "mongoose";
import chalk from "chalk";

async function databaseConnection() {
  const connection = await mongoose.connect(process.env.MONGO_URI);
  if (connection) {
    console.log(chalk.green("--- Database connected"));
  } else {
    console.log(chalk.red("--- Database not connected"));
  }
}
export default databaseConnection;
