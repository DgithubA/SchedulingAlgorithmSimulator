// roundRobin.ts
import { Process } from "../Process";

/**
 * Applies the Round Robin scheduling algorithm on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @param {number} quantum - The time slice for each process.
 * @returns {Process[]} - Array of processes, scheduled based on the Round Robin algorithm.
 */
export function roundRobin(processes: Process[], quantum: number = 1): Process[] {
  // Sort processes by arrival time if arrival time are same sort by primarity
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) {
      return a.arrival_time - b.arrival_time;
    }
    return b.primarity - a.primarity; // Higher priority first
  });

  const result: Process[] = [];
  const queue: { process: Process; remaining_time: number }[] = [];
  let currentTime = 0;
  let index = 0;

  while (queue.length > 0 || index < sortedProcesses.length) {//this loop run until All processes have been executed and no processes are left in the execution queue.
    // Enqueue newly arrived processes or Highest primarity
    while (
      index < sortedProcesses.length &&
      sortedProcesses[index].arrival_time <= currentTime
    ) {
      queue.push({
        process: sortedProcesses[index],
        remaining_time: sortedProcesses[index].burst_time,
      });
      index++;
    }

    if (queue.length === 0) {
      // Idle time until the next process arrives
      const nextProcess = sortedProcesses[index];
      const gapDuration = nextProcess.arrival_time - currentTime;
      result.push({
        process_id: -1,
        arrival_time: -1,
        burst_time: gapDuration,
        primarity:-1,
        background: "transparent",
      });
      currentTime += gapDuration;
    } else {
      // Dequeue a process and execute it for the quantum or until it finishes
      const { process, remaining_time } = queue.shift()!;
      const executionTime = Math.min(remaining_time, quantum);

      // Add the process slice to the result
      result.push({
        ...process,
        arrival_time: currentTime,
        burst_time: executionTime,
      });

      currentTime += executionTime;

      // Re-check for newly arrived processes after execution
      while (
        index < sortedProcesses.length &&
        sortedProcesses[index].arrival_time <= currentTime
      ) {
        queue.push({
          process: sortedProcesses[index],
          remaining_time: sortedProcesses[index].burst_time,
        });
        index++;
      }

      // If the process has remaining time, requeue it; otherwise, it completes
      if (remaining_time > quantum) {
        queue.push({
          process,
          remaining_time: remaining_time - quantum,
        });
      }
    }
  }

  // Merge consecutive executions of the same process for clarity
  const mergedResult: Process[] = [];
  for (let i = 0; i < result.length; i++) {
    const currentProcess = result[i];

    if (
      mergedResult.length > 0 &&
      mergedResult[mergedResult.length - 1].process_id ===
        currentProcess.process_id
    ) {
      // Merge with the previous process if the process_id is the same
      mergedResult[mergedResult.length - 1].burst_time +=
        currentProcess.burst_time;
    } else {
      // Otherwise, add as a new entry
      mergedResult.push({ ...currentProcess });
    }
  }
  //return result; // uncomment this line to show unmerged result
  return mergedResult;
}
