import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OrderProcess from "@/lib/OrderProcess";
import { Process } from "@/lib/Process";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
let waitingTime = 0;
let turnaroundTime = 0;
let cpuUtilization = 0;
let totalExecutionTime = 0;// New variable to export CPU utilization

type SummaryTableProps = {
  originalProcesses: Process[];
  scheduledProcesses: Process[];
  algorithm: string;
};

export function SummaryTable({
  originalProcesses,
  scheduledProcesses,
  algorithm,
}: SummaryTableProps) {
  const [animationKey, setAnimationKey] = useState(0);

  // Update the animation key whenever scheduledProcesses changes to re-trigger the animation
  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, [scheduledProcesses]);

  let totalWaitingTime = 0;
  let totalTurnaroundTime = 0;

  // Initialize calculated processes without waiting time calculation
  const calculatedProcesses = originalProcesses.map((process) => {
    return {
      ...process,
      waitingTime: 0,
      turnaroundTime: 0,
    };
  });

  if (algorithm == "HRRN" || algorithm == "NonPreemptivePriority" || algorithm == 'FCFS' || algorithm == "LCFS") {
    const orderedProcess = OrderProcess(scheduledProcesses);
    //console.log(JSON.stringify(orderedProcess,null,2));
    calculatedProcesses.forEach((process) => {
      const intervals = orderedProcess.filter(
        (scheduledProcess) => scheduledProcess.process_id === process.process_id
      );


      let processEndTime = intervals[0].arrival_time + intervals[0].burst_time;
      //console.log("process #"+intervals[0].process_id+ "| endTime:"+processEndTime+"| org arrival_time:"+process.arrival_time);
      process.turnaroundTime = processEndTime - process.arrival_time;
      process.waitingTime = process.turnaroundTime - intervals[0].burst_time;
      totalWaitingTime += process.waitingTime;
      totalTurnaroundTime += process.turnaroundTime;
    });
  }else if (algorithm === "RR") {
    calculatedProcesses.forEach((process) => {
      const intervals = scheduledProcesses.filter(
        (scheduledProcess) => scheduledProcess.process_id === process.process_id
      );
      /*
      for(let i=0;i<intervals.length;i++){
        console.log("process #"+process.process_id+" |interval #"+i+" |arrival_time: "+intervals[i].arrival_time+" |burst_time:"+intervals[i].burst_time);
      }
      */
      let lastInterval = intervals[intervals.length - 1];
      const endTime = lastInterval.arrival_time + lastInterval.burst_time;
      //console.log("process #"+process.process_id+" |lastInterval.arrival_time: "+lastInterval.arrival_time+" |lastInterval.burst_time:"+lastInterval.burst_time+" |end time: "+endTime);
      const turnaroundTime = endTime - process.arrival_time;
      const waitingTime = turnaroundTime - process.burst_time;

      process.waitingTime = waitingTime;
      process.turnaroundTime = turnaroundTime;

      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
    });  
  } else {
    // For other algorithms, use intervals in scheduledProcesses
    calculatedProcesses.forEach((process) => {
      const intervals = scheduledProcesses.filter(
        (scheduledProcess) => scheduledProcess.process_id === process.process_id
      );

      let processStartTime = process.arrival_time;
      let waitingTime = 0;

      intervals.forEach((interval) => {
        if (processStartTime < interval.arrival_time) {
          waitingTime += interval.arrival_time - processStartTime;
        }
        processStartTime = interval.arrival_time + interval.burst_time;
      });

      const turnaroundTime =
        waitingTime +
        intervals.reduce((sum, interval) => sum + interval.burst_time, 0);

      process.waitingTime = waitingTime;
      process.turnaroundTime = turnaroundTime;

      // Update cumulative totals
      totalWaitingTime += waitingTime;
      totalTurnaroundTime += turnaroundTime;
    });
  }

  waitingTime = totalWaitingTime;
  turnaroundTime = totalTurnaroundTime;

  // Calculate CPU utilization
  const totalBurstTime = scheduledProcesses.reduce(
    (sum, process) => process.arrival_time !== -1 ? sum + process.burst_time : sum + 0,
    0
  );

  const startTime = Math.min(
    ...scheduledProcesses.map((process) => process.arrival_time)
  );
  const endTime =
    startTime +
    scheduledProcesses.reduce((sum, process) => sum + process.burst_time, 0);

  totalExecutionTime = endTime - startTime;

  cpuUtilization = (totalBurstTime / totalExecutionTime) * 100;

  const popOutVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={popOutVariants}
      key={animationKey}
    >
      <Table>
        <TableCaption>
          A summary of your processes including waiting and turnaround times.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] text-center">
              <p className="text-xs md:text-lg">Process ID</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Arrival Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Burst Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">primarity</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Waiting Time</p>
            </TableHead>
            <TableHead className="text-center">
              <p className="text-xs md:text-lg">Turnaround Time</p>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {calculatedProcesses.map((process) => (
            <TableRow key={process.process_id}>
              <TableCell className="font-medium flex justify-center">
                <div
                  className="preview flex justify-center items-center p-1 h-[25px] w-[25px] rounded !bg-cover !bg-center transition-all"
                  style={{
                    background: process.background,
                  }}
                >
                  {process.process_id}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {process.arrival_time}
              </TableCell>
              <TableCell className="text-center">
                {process.burst_time}
              </TableCell>
              <TableCell className="text-center">
                {process.primarity}
              </TableCell>
              <TableCell className="text-center">
                {process.waitingTime}
              </TableCell>
              <TableCell className="text-center">
                {process.turnaroundTime}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} className="pl-3 text-xs">
              Total
            </TableCell>
            <TableCell className="text-center">{totalWaitingTime}</TableCell>
            <TableCell className="text-center">{totalTurnaroundTime}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </motion.div>
  );
}

export { waitingTime, turnaroundTime, cpuUtilization, totalExecutionTime };
