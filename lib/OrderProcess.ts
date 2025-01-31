import { Process } from "./Process";



/**
 * Applies the order
 *
 * @param {Process[]} processes - Array of process objects, each having arrival_time, burst_time, and background properties.
 * @returns {Process[]} - Array of processes, with idles.
 */
export default function OrderProcess(processes: Process[]): Process[] {
    const result: Process[] = processes.map(process => ({ ...process })); // کپی عمیق اشیا

    for (let i = 0; i < processes.length - 1; i++) {
        let currentProcess = result[i];
        let nextProcess = result[i + 1];
        
        let currentProcessEndTime = currentProcess.arrival_time + currentProcess.burst_time;
        nextProcess.arrival_time = Math.max(nextProcess.arrival_time, currentProcessEndTime);
    }

    return result;
}

