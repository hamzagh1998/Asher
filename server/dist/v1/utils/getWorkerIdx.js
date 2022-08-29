"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkerIdx = void 0;
const farmhash_1 = __importDefault(require("farmhash"));
// Helper function for getting a worker index based on IP address.
// The way it works is by converting the IP address to a number by removing non numeric
// characters, then compressing it to the number of slots we have.
//
// Compared against "real" hashing (from the sticky-session code) and
// "real" IP number conversion, this function is on par in terms of
// worker index distribution only much faster.
function getWorkerIdx(ip, len) {
    return farmhash_1.default.fingerprint32(ip) % len; // Farmhash is the fastest and works with IPv6, too
}
exports.getWorkerIdx = getWorkerIdx;
;
