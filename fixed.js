
// Array for partition sizes
let memoryPartitions = [];
let memoryPartitionsCopy = [];
let processes = [];
let validationFlag = 0;

const noOfPartitions = document.getElementById('numOfPartitions');
const partitionSize = document.getElementById('partitionSize');
const processesSize = document.getElementById('processSize');
const allocType = document.getElementById('allocType');
const allocText = document.getElementById('alloc-h1');

var submitBtn = document.getElementById('submitBtn');

function runAlgo() {
    // Change H1 to the selected allocation type
    var selectedAlloc = allocType.options[allocType.selectedIndex].text;
    allocText.innerHTML = selectedAlloc;

    // Get the container .blocks
    var blocks = document.getElementById('blocks');

    blocks.innerHTML = '';

    allocText.classList.add('animate');

    setTimeout(function() {
        allocText.classList.remove('animate');
    }, 1000);

    // Array for partition sizes
    memoryPartitions = partitionSize.value.split(',').map(Number);
    memoryPartitionsCopy = [...memoryPartitions]

    // Array for partition sizes
    processes = processesSize.value.split(',').map(Number);

    if (selectedAlloc == "First Fit") {
        var allocation = firstFit(memoryPartitions, processes);
        printAllocation(allocation, "First Fit");
    } else if (selectedAlloc == "Best Fit") {
        var allocation = bestFit(memoryPartitions, processes);
        printAllocation(allocation, "Best Fit");
    } else if (selectedAlloc == "Worst Fit") {
        var allocation = worstFit(memoryPartitions, processes);
        printAllocation(allocation, "Worst Fit");
    }

    // Create a new div
    for (let i = 0; i < noOfPartitions.value; i++) {
        var newDiv = document.createElement('div');
        newDiv.className = 'block';
        newDiv.textContent = memoryPartitions[i] + "K"; // Set the text content of the new div
        newDiv.style.border = "1px solid #f26a2e";
        // newDiv.style.backgroundColor = "#fff";
        newDiv.style.color = "#fff";

        if (memoryPartitions[i] != memoryPartitionsCopy[i]) {
            newDiv.style.backgroundColor = "#f09873";
            newDiv.style.color = "#1f1f1f";
        }
        // Add the new div to the container
        blocks.appendChild(newDiv);


        newDiv.offsetHeight;
        newDiv.classList.add('block', 'show');
    }

    const divs = document.querySelectorAll('.block');

    const firstDiv = divs[0];
    const lastDiv = divs[divs.length - 1];

    firstDiv.style.borderRadius = "20px 20px 0px 0px";
    lastDiv.style.borderRadius = "0px 0px 20px 20px";
    
}

// First Fit
function firstFit(memoryPartitions, processes) {
    let allocation = Array(processes.length).fill(-1);
    let isPartitionUsed = Array(memoryPartitions.length).fill(false);

    for (let i = 0; i < processes.length; i++) {
        for (let j = 0; j < memoryPartitions.length; j++) {
            if (!isPartitionUsed[j] && memoryPartitions[j] >= processes[i]) {
                allocation[i] = j;
                memoryPartitions[j] -= processes[i];
                isPartitionUsed[j] = true;
                break;
            }
        }
    }
    return allocation;
}

// Best Fit
function bestFit(memoryPartitions, processes) {
    let allocation = Array(processes.length).fill(-1);
    let isPartitionUsed = Array(memoryPartitions.length).fill(false);

    for (let i = 0; i < processes.length; i++) {
        let bestIdx = -1;
        for (let j = 0; j < memoryPartitions.length; j++) {
            if (!isPartitionUsed[j] && memoryPartitions[j] >= processes[i] && (bestIdx == -1 || memoryPartitions[bestIdx] > memoryPartitions[j])) {
                bestIdx = j;
            }
        }
        if (bestIdx != -1) {
            allocation[i] = bestIdx;
            memoryPartitions[bestIdx] -= processes[i];
            isPartitionUsed[bestIdx] = true;
        }
    }
    return allocation;
}

// Worst Fit
function worstFit(memoryPartitions, processes) {
    let allocation = Array(processes.length).fill(-1);
    let isPartitionUsed = Array(memoryPartitions.length).fill(false);

    for (let i = 0; i < processes.length; i++) {
        let worstIdx = -1;
        for (let j = 0; j < memoryPartitions.length; j++) {
            if (!isPartitionUsed[j] && memoryPartitions[j] >= processes[i] && (worstIdx == -1 || memoryPartitions[worstIdx] < memoryPartitions[j])) {
                worstIdx = j;
            }
        }
        if (worstIdx != -1) {
            allocation[i] = worstIdx;
            memoryPartitions[worstIdx] -= processes[i];
            isPartitionUsed[worstIdx] = true;
        }
    }
    return allocation;
}

function printAllocation(allocation, scheme) {
    // Get the div element by its ID
    let resultDiv = document.getElementById('resultText');

    let internalFragment = memoryPartitions.reduce((fragment, partition) => fragment + partition, 0);

    // Clear previous content
    resultDiv.innerHTML = '';

    // Append scheme name to the div
    resultDiv.innerHTML += scheme + " Allocation: <br><br>";

    // Iterate through the allocation array
    for (let i = 0; i < allocation.length; i++) {
        if (allocation[i] != -1) {
            // Append allocation details to the div
            resultDiv.innerHTML += "Process " + (i + 1) + " is allocated at Partition " + (allocation[i] + 1) + "<br><br>";
        } else {
            // Append unallocated process details to the div
            resultDiv.innerHTML += "Process " + (i + 1) + " is not allocated <br><br>";
        }
    }

    resultDiv.innerHTML += "Total Internal Fragment: " + internalFragment + "K" + "<br>";
    resultDiv.style.fontSize = "15px";
    margin = "5px";
}

// Reset all inputs
function clear(){
    document.getElementById('alloc-h1').innerHTML = "Fixed Partition";

    numOfPartitions.value = "";
    partitionSize.value = "";
    processesSize.value = "";

    // Array for partition sizes
    memoryPartitions = [];

    // Array for partition sizes
    processes = [];
}

// Check if input has a negative value
function hasNegativeValue(arr) {
    // Use the some method to check if any element is negative
    return arr.some(function (element) {
        return element < 0;
    });
}

// Check if partition size is valid
function validateCount() {
    var partitionCountError = document.getElementById('partitionCountError');

    if (noOfPartitions.value == "") {
        partitionCountError.innerHTML = "Please enter the number of partitions";
        noOfPartitions.classList.add('shake');
        return;
    } else if (noOfPartitions.value <= 0) {
        partitionCountError.innerHTML = "Please enter a positive number";
        noOfPartitions.classList.add('shake');
        return;
    } else {
        partitionCountError.innerHTML = "";
        validationFlag++;
    }
}

// Check if partition size is valid
function validateSize() {
    var partitionSizeError = document.getElementById('partitionSizeError');
    memoryPartitions = partitionSize.value.split(',').map(Number);

    if (partitionSize.value == "") {
        partitionSizeError.innerHTML = "Please enter the partition sizes";
        partitionSize.classList.add('shake');
        return;
    } else if (memoryPartitions.length != noOfPartitions.value) {
        partitionSizeError.innerHTML = "Partition size count does not match the partition count";
        partitionSize.classList.add('shake');
        return;
    } else if (/\s/.test(partitionSize.value)) {
        partitionSizeError.innerHTML = "Please remove spaces between partition sizes";
        partitionSize.classList.add('shake');
        return;
    } else if (hasNegativeValue(memoryPartitions)) {
        partitionSizeError.innerHTML = "Please enter positive partition sizes";
        partitionSize.classList.add('shake');
        return;
    } else {
        partitionSizeError.innerHTML = "";
        validationFlag++;
    }
}

// Check if process size is valid
function validateProcess() {
    var processSizeError = document.getElementById('processSizeError');
    processes = processesSize.value.split(',').map(Number);

    if (processesSize.value == "") {
        processSizeError.innerHTML = "Please enter the process sizes";
        processesSize.classList.add('shake');
        return;
        //Check if there is a whitespace
    } else if (/\s/.test(processesSize.value)) {
        processSizeError.innerHTML = "Please remove spaces between process sizes";
        processesSize.classList.add('shake');
        return;
    } else if (hasNegativeValue(processes)) {
        processSizeError.innerHTML = "Please enter positive process sizes";
        processesSize.classList.add('shake');
        return;
    } else {
        processSizeError.innerHTML = "";
        validationFlag++;
    }
}

// Call all validation functions and if they are all valid, run the algorithm
function run() {
    validationFlag = 0;
    console.log(validationFlag)
    event.preventDefault();
    validateCount();
    validateSize();
    validateProcess();
    if (validationFlag == 3) {
        runAlgo();
    }
}



// Pages
var homeLink = document.querySelectorAll('.home');
var aboutLink = document.querySelectorAll('.about');
var membersLink = document.querySelectorAll('.members');

//Page Transition
function pageTransition(link){
    document.addEventListener('DOMContentLoaded', function () {
        link.forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                // Add the fade-out class to trigger the transition
                document.body.classList.add('fade-out');

                // Wait for the transition to complete before navigating to the new page
                setTimeout(function () {
                    window.location.href = link.href;
                }, 500); // Adjust the time to match the transition duration
            });
        });
    });
}

pageTransition(homeLink);
pageTransition(aboutLink);
pageTransition(membersLink);

