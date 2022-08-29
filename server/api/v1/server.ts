// check: https://github.com/elad/node-cluster-socket.io
import cluster, { Cluster, Worker } from "cluster";
import net from "net"
import { cpus } from "os";
import path from "path";

import dotenv from "dotenv"
import { Server } from "socket.io";
import { createClient } from "redis";
import {createAdapter} from "@socket.io/redis-adapter";

import { app } from "./app"
import { connectDB } from "./config/DB";
import { logger } from "./logger";

import { spawnWorker, getWorkerIdx } from "./utils"

dotenv.config({ path: path.resolve(__dirname, "./config/.env") });

const PORT: string = process.env.PORT || "5000";
const processesNum: number = cpus().length;

if (process.env.NODE_ENV === "development") {
  connectDB(process.env.MONGO_DEV_URL!)
} else {
  connectDB(process.env.MONGO_PRO_URL!)
}

if (process.env.NODE_ENV === "production") {
  if (cluster.isPrimary) {
    let workers: Array<Worker> = [];
    
    for (let i=0; i<processesNum; i++) spawnWorker<Worker, Cluster>(workers, cluster, i);
  
      // in this case, we are going to start up a tcp connection via the net
      // module INSTEAD OF the http module. Express will use http, but we need
      // an independent tcp port open for cluster to work. This is the port that 
      // will face the internet
      const server = net.createServer({ pauseOnConnect: true }, (connection: net.Socket) => {
        // We received a connection and need to pass it to the appropriate
        // worker. Get the worker for this connection's source IP and pass
        // it the connection.    
        const ip = connection.remoteAddress! 
        const worker = workers[getWorkerIdx(ip, processesNum)];
        worker.send("sticky-session:connection", connection);
      });
  
      server.listen(PORT, () => logger.info("Master listening on port: " + PORT));
  } else {
    // Don't expose our internal server to the outside world.
    const server = app.listen(0, "localhost");
    const io = new Server(server);
    // https://socket.io/docs/v4/redis-adapter/#migrating-from-socketio-redis
    const pubClient = createClient({ url: "redis://localhost:6379" });
    const subClient = pubClient.duplicate();
  
    io.adapter(createAdapter(pubClient, subClient));
  
    io.on("connection", socket => {
  
      const workerId = cluster.worker && cluster.worker.id!
      logger.info("socket connected to worker: " + workerId);
    });
  
    // Listen to messages sent from the master. Ignore everything else.
    process.on("message", (message: string, connection: net.Socket) => {
      if (message !== "sticky-session:connection") return;
      // Emulate a connection event on the server by emitting the
      // event with the connection the master sent us.
      server.emit("connection", connection);    
  
      connection.resume();
    });
  };
} else {
   const server = app.listen(PORT, () => logger.info("server run on development mode on port: " + PORT));
   const io = new Server(server);

   const pubClient = createClient({ url: "redis://localhost:6379" });
   const subClient = pubClient.duplicate();
 
   io.adapter(createAdapter(pubClient, subClient));
 
   io.on("connection", socket => {

   });
};