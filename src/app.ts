/** @format */

import express, { Express } from "express";
import { ChattyServer } from "./setupServer";
import databaseConnection from "./setupDatabase";
import { config } from "./config";

class Application {
  public initialize(): void {
    this.loadConfig();
    databaseConnection();

    const app: Express = express();
    const chattyServer: ChattyServer = new ChattyServer(app);
    chattyServer.start();
  }

  public loadConfig(): void {
    config.validateConfig();
    config.cloudinaryConfig();
  }
}

const application: Application = new Application();
application.initialize();
