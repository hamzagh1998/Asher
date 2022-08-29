"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.devLogger = void 0;
const winston_1 = __importDefault(require("winston"));
const logFormat = winston_1.default.format.printf(({ level, message, stack, timestamp }) => {
    return `[${timestamp}]: ${level}: ${message || stack}`;
});
function devLogger() {
    return winston_1.default.createLogger({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.default.format.errors({ stack: true }), logFormat),
        transports: [
            new winston_1.default.transports.Console()
        ]
    });
}
exports.devLogger = devLogger;
