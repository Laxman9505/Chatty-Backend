/** @format */

import Logger from "bunyan";
import mongoose from "mongoose";
import { config } from "./config";

const log: Logger = config.createLogger("Setup Database");

export default () => {
  const connect = async () => {
    if (!config.DATABASE_URL) {
      return;
    }
    try {
      await mongoose.connect(config.DATABASE_URL);
      log.info("MongoDB Connected Successfully !");
    } catch (error) {
      log.info("Error Connecting to the database", error);
      return process.exit();
    }
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
