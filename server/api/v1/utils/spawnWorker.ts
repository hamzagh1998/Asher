import { logger } from "../logger";

export function spawnWorker<
  X extends  { on(a: string, b: Function): void }, 
  Y extends {fork(): X }>
  (workers: Array<X>, cluster: Y, i: number) {
  workers[i] = cluster.fork();

  // Optional: Restart worker on exit
  workers[i].on('exit', () => {
    logger.info('respawning worker', i);
    spawnWorker(workers, cluster, i);
  });
};