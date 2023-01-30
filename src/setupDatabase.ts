/** @format */

import Logger from "bunyan";
import mongoose from "mongoose";
import { config } from "./config";

const log: Logger = config.createLogger("Setup Database");

export default () => {
  const connect = () => {
    if (!config.DATABASE_URL) {
      return;
    }
    mongoose
      .connect(config.DATABASE_URL)
      .then(() => {
        log.info("Mongodb Connected Succssfully !");
      })
      .catch((error) => {
        log.info("Error Connecting to the database", error);
        return process.exit();
      });
  };
  connect();
  mongoose.connection.on("disconnected", connect);
};
