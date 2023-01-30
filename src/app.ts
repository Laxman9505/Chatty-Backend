/** @format */

import express, { Express } from "express";
import { ChattyServer } from "./setupServer";
import databaseConnection from "./setupDatabase";
import { config } from "./config";

class Application {
  public initialize(): void {
    config.validateConfig();
    databaseConnection();
    const app: Express = express();
    const chattyServer: ChattyServer = new ChattyServer(app);
    chattyServer.start();
  }
}

const application: Application = new Application();
application.initialize();
