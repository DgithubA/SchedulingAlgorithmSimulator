import { Process } from "@/lib/Process";
import { turnaroundTime, waitingTime, cpuUtilization, totalExecutionTime } from "./SummaryTable"
import AnimatedShinyText from "./ui/animated-shiny-text";
import { Tooltip } from "@heroui/tooltip";

type totalProcessesType = {
  totalProcesses: number;
  scheduledProcesses: Process[];
};

export default function SummaryStatistics({ totalProcesses, scheduledProcesses }: totalProcessesType) {

  return (
    <div className="flex flex-col justify-evenly items-center md:w-1/2 md:pl-10 pt-4">
      <div className="flex justify-evenly w-full text-center">
        <Tooltip content="waitingTime / totalProcesses" delay={300}>
          <div className="text-sm md:text-lg">
            <AnimatedShinyText>Avg Waiting Time</AnimatedShinyText>
            {waitingTime + '/' + totalProcesses + ' ≈ ' + Math.round((waitingTime / totalProcesses) * 100) / 100}
          </div>
        </Tooltip>
        <Tooltip content="turnaroundTime / totalProcesses" delay={300}>
          <div className="text-sm md:text-lg">
            <AnimatedShinyText>Avg Turnaround Time</AnimatedShinyText>
            {turnaroundTime + '/' + totalProcesses + ' ≈ ' + Math.round((turnaroundTime / totalProcesses) * 100) / 100}
          </div>
        </Tooltip>
      </div>
      <div className="flex justify-evenly w-full text-center">
        <Tooltip content="totalProcesses / totalExecutionTime" delay={300}>
          <div className="text-sm md:text-lg">
            <AnimatedShinyText>Throughput</AnimatedShinyText>
            {totalProcesses + '/' + totalExecutionTime + ' ≈ ' + Math.round((totalProcesses / totalExecutionTime) * 100) / 100}
          </div>
        </Tooltip>
        <Tooltip content="totalBurstTime / totalExecutionTime" delay={300}>
          <div className="text-sm md:text-lg">
            <AnimatedShinyText>CPU Utilization</AnimatedShinyText>
            {Math.round(cpuUtilization * 100) / 100}%
          </div>
        </Tooltip>
      </div>
    </div>
  );
}