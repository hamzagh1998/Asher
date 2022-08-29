"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnWorker = void 0;
const logger_1 = require("../logger");
function spawnWorker(workers, cluster, i) {
    workers[i] = cluster.fork();
    // Optional: Restart worker on exit
    workers[i].on('exit', () => {
        logger_1.logger.info('respawning worker', i);
        spawnWorker(workers, cluster, i);
    });
}
exports.spawnWorker = spawnWorker;
;
