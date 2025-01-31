import { Process } from "../Process";
import IdleProcess from "../IdleProcess";

/**
 * Applies the Last Come First Serve (LCFS) scheduling algorithm
 * on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having
 *                                arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes sorted by arrival_time (descending) with gaps included.
 */
export function lastComeFirstServe(processes: Process[]): Process[] {
  // index 0 have lowest arrival_time
  const sortedProcesses = [...processes].sort((a, b) => {
    if (a.arrival_time !== b.arrival_time) {
      return a.arrival_time - b.arrival_time;
    }
    return b.primarity - a.primarity; // Higher priority first
  });

  let remainingProcess = [...sortedProcesses];
  const result: Process[] = [];
  let currentTime = 0;
  let firstArrived = remainingProcess.shift()!;

  if(firstArrived.arrival_time > 0){
    result.push({
      process_id: -1,
      arrival_time: -1,
      burst_time: firstArrived.arrival_time,
      primarity:-1,
      background: "transparent",
    });
    currentTime += firstArrived.arrival_time;
  }
  result.push(firstArrived);
  currentTime += firstArrived.burst_time;
  result.push();

  while (0 < remainingProcess.length) {//this loop run until All processes have been executed and no processes are left in the execution queue.
    
    
    let availableProcess: Process[] = [];
    // Enqueue newly arrived processes or Highest primarity
    remainingProcess.forEach((process) => {
      if(process.arrival_time <= currentTime){
        availableProcess.push(process);
      }
    });

    // index 0 have lowest arrival_time
    remainingProcess.sort((a, b) => {
      if (a.arrival_time !== b.arrival_time) {
        return a.arrival_time - b.arrival_time;
      }
      return b.primarity - a.primarity; // Higher priority first
    });


    console.log(
      "current time: " + currentTime +
      " | remain processes id: " + remainingProcess.map(p => p.process_id).join(", ") +
      " | available processes id: " + availableProcess.map(p => p.process_id).join(", ")
    );


    if (availableProcess.length === 0 && 0 < remainingProcess.length) {
      // Idle time until the next process arrives
      const nextProcess = remainingProcess[0];
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
      
      // index 0 have bigest arrival_time
      availableProcess.sort((a, b) => {
        if (a.arrival_time !== b.arrival_time) {
          return b.arrival_time - a.arrival_time;
        }
        return b.primarity - a.primarity; // Higher priority first
      });
      const process = availableProcess.shift()!;
      //console.log("selected process id: " + process.process_id);
      // Add the process slice to the result
      result.push(process);
      currentTime += process.burst_time;
      //remove from remainingProcess
      remainingProcess = remainingProcess.filter((p) => p.process_id !== process.process_id);
    }
  }

  // Apply IdleProcess to add gaps if necessary
  return (result);
}
