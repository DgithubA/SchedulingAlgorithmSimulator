
import IdleProcess from "../IdleProcess";
import { Process } from "../Process";



/**
 * Applies the Highest Response Ratio Next scheduling algorithm on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes, scheduled based on the SJF algorithm.
 */
export function HighestResponeRatioNext(processes: Process[]): Process[] {
    // Sort processes by arrival time if arrival time are same sort by primarity
    const sortedProcesses = [...processes].sort((a, b) => {
        if (a.arrival_time !== b.arrival_time) {
            return a.arrival_time - b.arrival_time;
        }
        return b.primarity - a.primarity; // Higher priority first
    });
    const result: Process[] = [];
    let currentTime = 0;
    let queue: { process: Process; responseRatio: number }[] = [];
    let index = 0;




    // Check if there is an initial gap before the first process
    if (sortedProcesses[0].arrival_time > 0) {
        result.push({
            process_id: -1,
            arrival_time: -1, // Not significant for gap
            burst_time: sortedProcesses[0].arrival_time, // Duration of the initial idle time
            primarity: sortedProcesses[0].primarity,
            background: "transparent", // Color for gap
        });
    }



    currentTime += sortedProcesses[0].arrival_time;
    //first process

    result.push(sortedProcesses[0]);
    currentTime += sortedProcesses[0].burst_time;
    sortedProcesses.shift()!;

    sortedProcesses.forEach((process,index) => {
        queue.push({
            process: process,
            responseRatio: (currentTime - process.arrival_time) / process.burst_time,
          });
    });

    while (queue.length > 0) {//this loop run until All processes have been executed
        queue.forEach((queue,index) => {
            queue.responseRatio = (currentTime - queue.process.arrival_time) / queue.process.burst_time;
        });
        queue.sort((a, b) => b.responseRatio - a.responseRatio);
        
        const { process, responseRatio } = queue.shift()!;
        result.push(process);
        currentTime += process.burst_time;
    }


    return IdleProcess(result);
}