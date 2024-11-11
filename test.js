// Memory Allocation in JavaScript

let memoryPartitions = [];
let processes = [];

// User Inputs
let numPartitions = prompt("Enter the number of memory partitions: ");
for (let i = 0; i < numPartitions; i++) {
    memoryPartitions[i] = prompt("Enter the size of partition " + (i + 1) + ": ");
}

let numProcesses = prompt("Enter the number of processes: ");
for (let i = 0; i < numProcesses; i++) {
    processes[i] = prompt("Enter the size of process " + (i + 1) + ": ");
}

// First Fit
function firstFit(memoryPartitions, processes) {
    let allocation = Array(processes.length).fill(-1);
    for (let i = 0; i < processes.length; i++) {
        for (let j = 0; j < memoryPartitions.length; j++) {
            if (memoryPartitions[j] >= processes[i]) {
                allocation[i] = j;
                memoryPartitions[j] -= processes[i];
                break;
            }
        }
    }
    return allocation;
}

// Best Fit
function bestFit(memoryPartitions, processes) {
    let allocation = Array(processes.length).fill(-1);
    for (let i = 0; i < processes.length; i++) {
        let bestIdx = -1;
        for (let j = 0; j < memoryPartitions.length; j++) {
            if (memoryPartitions[j] >= processes[i] && (bestIdx == -1 || memoryPartitions[bestIdx] > memoryPartitions[j])) {
                bestIdx = j;
            }
        }
        if (bestIdx != -1) {
            allocation[i] = bestIdx;
            memoryPartitions[bestIdx] -= processes[i];
        }
    }
    return allocation;
}

// Worst Fit
function worstFit(memoryPartitions, processes) {
    let allocation = Array(processes.length).fill(-1);
    for (let i = 0; i < processes.length; i++) {
        let worstIdx = -1;
        for (let j = 0; j < memoryPartitions.length; j++) {
            if (memoryPartitions[j] >= processes[i] && (worstIdx == -1 || memoryPartitions[worstIdx] < memoryPartitions[j])) {
                worstIdx = j;
            }
        }
        if (worstIdx != -1) {
            allocation[i] = worstIdx;
            memoryPartitions[worstIdx] -= processes[i];
        }
    }
    return allocation;
}

// Print Allocation
function printAllocation(allocation, scheme) {
    console.log(scheme + " Allocation: ");
    for (let i = 0; i < allocation.length; i++) {
        if (allocation[i] != -1) {
            console.log("Process " + (i + 1) + " is allocated at Partition " + (allocation[i] + 1));
        } else {
            console.log("Process " + (i + 1) + " is not allocated");
        }
    }
}

printAllocation(firstFit([...memoryPartitions], [...processes]), "First Fit");
printAllocation(bestFit([...memoryPartitions], [...processes]), "Best Fit");
printAllocation(worstFit([...memoryPartitions], [...processes]), "Worst Fit");
