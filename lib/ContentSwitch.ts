




/**
 * Applies the Round Robin scheduling algorithm on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @param {number} contentSwitchTime - The content switch time.
 * @returns {Process[]} - Array of processes, scheduled based on content switch time.
 */

import { Process } from "./Process";



export default function ContentSwitch(processes: Process[],contentSwitchTime : number = 0): Process[]{
    const result: Process[] = [];
    for (let i = 0; i < processes.length; i++) {
      const currentProcess = processes[i];
      const nextporcess = processes[i+1];
      result.push(currentProcess);

      if(nextporcess !== undefined && currentProcess.process_id !== nextporcess.process_id && nextporcess.process_id !== -1 && currentProcess.process_id !== -1){
        result.push({process_id:-2,arrival_time:-2,burst_time:contentSwitchTime,primarity:-2,background:"transparent"});
        processes.forEach((process,index)=>{
          process.arrival_time += contentSwitchTime;
        });
      }
    }
    return result;
}