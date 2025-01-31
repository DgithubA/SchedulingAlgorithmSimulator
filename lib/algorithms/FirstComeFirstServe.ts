// Define the Process type

import { Result } from "postcss";
import { Process } from "../Process";
import IdleProcess from "../IdleProcess";


/**
 * Applies the First Come First Serve (FCFS) scheduling algorithm
 * on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having
 *                                arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes sorted by arrival_time with gaps included.
 */
export function firstComeFirstServe(processes: Process[]): Process[] {
  // Sort processes by arrival time if arrival time are same sort by primarity
  processes.sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) {
      return a.arrival_time - b.arrival_time;
    }
    return b.primarity - a.primarity; // Higher priority first
  });

  return IdleProcess(processes);
}
