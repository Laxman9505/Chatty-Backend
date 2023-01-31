"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const log = config_1.config.createLogger("Setup Database");
exports.default = () => {
    const connect = () => {
        if (!config_1.config.DATABASE_URL) {
            return;
        }
        mongoose_1.default
            .connect(config_1.config.DATABASE_URL)
            .then(() => {
            log.info("Mongodb Connected Succssfully !");
        })
            .catch((error) => {
            log.info("Error Connecting to the database", error);
            return process.exit();
        });
    };
    connect();
    mongoose_1.default.connection.on("disconnected", connect);
};
//# sourceMappingURL=setupDatabase.js.map