"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const dev_logger_1 = require("./dev.logger");
const prod_logger_1 = require("./prod.logger");
exports.logger = process.env.NODE_ENV === "development" ? (0, dev_logger_1.devLogger)() : (0, prod_logger_1.prodLogger)();
