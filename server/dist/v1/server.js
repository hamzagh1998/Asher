"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// check: https://github.com/elad/node-cluster-socket.io
const cluster_1 = __importDefault(require("cluster"));
const net_1 = __importDefault(require("net"));
const os_1 = require("os");
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("socket.io");
const redis_1 = require("redis");
const redis_adapter_1 = require("@socket.io/redis-adapter");
const app_1 = require("./app");
const DB_1 = require("./config/DB");
const logger_1 = require("./logger");
const utils_1 = require("./utils");
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "./config/.env") });
const PORT = process.env.PORT || "5000";
const processesNum = (0, os_1.cpus)().length;
if (process.env.NODE_ENV === "development") {
    (0, DB_1.connectDB)(process.env.MONGO_DEV_URL);
}
else {
    (0, DB_1.connectDB)(process.env.MONGO_PRO_URL);
}
if (process.env.NODE_ENV === "production") {
    if (cluster_1.default.isPrimary) {
        let workers = [];
        for (let i = 0; i < processesNum; i++)
            (0, utils_1.spawnWorker)(workers, cluster_1.default, i);
        // in this case, we are going to start up a tcp connection via the net
        // module INSTEAD OF the http module. Express will use http, but we need
        // an independent tcp port open for cluster to work. This is the port that 
        // will face the internet
        const server = net_1.default.createServer({ pauseOnConnect: true }, (connection) => {
            // We received a connection and need to pass it to the appropriate
            // worker. Get the worker for this connection's source IP and pass
            // it the connection.    
            const ip = connection.remoteAddress;
            const worker = workers[(0, utils_1.getWorkerIdx)(ip, processesNum)];
            worker.send("sticky-session:connection", connection);
        });
        server.listen(PORT, () => logger_1.logger.info("Master listening on port: " + PORT));
    }
    else {
        // Don't expose our internal server to the outside world.
        const server = app_1.app.listen(0, "localhost");
        const io = new socket_io_1.Server(server);
        // https://socket.io/docs/v4/redis-adapter/#migrating-from-socketio-redis
        const pubClient = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
        const subClient = pubClient.duplicate();
        io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
        io.on("connection", socket => {
            const workerId = cluster_1.default.worker && cluster_1.default.worker.id;
            logger_1.logger.info("socket connected to worker: " + workerId);
        });
        // Listen to messages sent from the master. Ignore everything else.
        process.on("message", (message, connection) => {
            if (message !== "sticky-session:connection")
                return;
            // Emulate a connection event on the server by emitting the
            // event with the connection the master sent us.
            server.emit("connection", connection);
            connection.resume();
        });
    }
    ;
}
else {
    const server = app_1.app.listen(PORT, () => logger_1.logger.info("server run on development mode on port: " + PORT));
    const io = new socket_io_1.Server(server);
    const pubClient = (0, redis_1.createClient)({ url: "redis://localhost:6379" });
    const subClient = pubClient.duplicate();
    io.adapter((0, redis_adapter_1.createAdapter)(pubClient, subClient));
    io.on("connection", socket => {
    });
}
;
