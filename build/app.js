"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const setupServer_1 = require("./setupServer");
const setupDatabase_1 = __importDefault(require("./setupDatabase"));
const config_1 = require("./config");
class Application {
    initialize() {
        config_1.config.validateConfig();
        (0, setupDatabase_1.default)();
        const app = (0, express_1.default)();
        const chattyServer = new setupServer_1.ChattyServer(app);
        chattyServer.start();
    }
}
const application = new Application();
application.initialize();
//# sourceMappingURL=app.js.map