




/**
 * Applies the Round Robin scheduling algorithm on an array of process objects.
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @param {number} contextSwitchTime - The context switch time.
 * @returns {Process[]} - Array of processes, scheduled based on context switch time.
 */

import { Process } from "./Process";



export default function ContextSwitch(processes: Process[],contextSwitchTime : number = 0): Process[]{
    const result: Process[] = [];
    for (let i = 0; i < processes.length; i++) {
      const currentProcess = processes[i];
      const nextporcess = processes[i+1];
      result.push(currentProcess);

      if(nextporcess !== undefined && currentProcess.process_id !== nextporcess.process_id && nextporcess.process_id !== -1 && currentProcess.process_id !== -1){
        result.push({process_id:-2,arrival_time:currentProcess.burst_time,burst_time:contextSwitchTime,primarity:-2,background:"transparent"});
        //add arrival_time to next process
        for (let j = i+1; j < processes.length; j++) {
          processes[j].arrival_time += contextSwitchTime;
        }
      }
    }
    return result;
}