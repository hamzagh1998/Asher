"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prodLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
function prodLogger() {
    return winston_1.default.createLogger({
        format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
        transports: [
            new winston_1.default.transports.File({
                filename: path_1.default.resolve(__dirname, "..", "..", "..", "public", "logs/info.log"),
                level: "info",
                format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
            }),
            new winston_1.default.transports.File({
                filename: path_1.default.resolve(__dirname, "..", "..", "..", "public", "logs/warn.log"),
                level: "warn",
                format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
            }),
            new winston_1.default.transports.File({
                filename: path_1.default.resolve(__dirname, "..", "..", "..", "public", "logs/error.log"),
                level: "error",
                format: winston_1.default.format.combine(winston_1.default.format.timestamp(), winston_1.default.format.json())
            })
        ]
    });
}
exports.prodLogger = prodLogger;
