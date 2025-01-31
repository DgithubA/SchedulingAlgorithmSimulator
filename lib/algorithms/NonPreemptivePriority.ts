

import IdleProcess from "../IdleProcess";
import { Process } from "../Process";



/**
 * Applies the Highest Response Ratio Next scheduling algorithm on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes, scheduled based on the SJF algorithm.
 */
export function NonPreenptivePriority(processes: Process[]): Process[] {
    processes.sort((a, b) => {
        if (a.arrival_time !== b.arrival_time) {
          return a.arrival_time - b.arrival_time;
        }
        return b.primarity - a.primarity; // Higher priority first
      });
    return IdleProcess(processes);
}