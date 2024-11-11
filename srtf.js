
//Error Messages
var processCountError = document.getElementById('processCountError');
var arrivalTimeError = document.getElementById('arrivalTimeError');
var burstTimeError = document.getElementById('burstTimeError');

//Input Fields
var arrivalTimes = document.getElementById('all_arrival_times');
var inputProcess = document.getElementById('num_processes');
var burstTimes = document.getElementById('all_burst_times');

function runScheduler() {

    let validationFlag = 0;

    const numProcesses = document.getElementById('num_processes').value;
    const allArrivalTimes = document.getElementById('all_arrival_times').value.split(',').map(Number);
    const allBurstTimes = document.getElementById('all_burst_times').value.split(',').map(Number);

    ////Validate input for process count
    if (numProcesses == 0) {
        processCountError.innerHTML = "Please enter the number of processes";
        inputProcess.classList.add('shake');

    } else if (numProcesses <= 0) {
        processCountError.innerHTML = "Please enter a positive number";
        inputProcess.classList.add('shake');

    } else {
        processCountError.innerHTML = "";
        validationFlag++;
    }

    //Validate input for arrival times
    if (arrivalTimes.value == "") {
        arrivalTimeError.innerHTML = "Please enter the arrival times";
        arrivalTimes.classList.add('shake');

    } else if (allArrivalTimes.length != numProcesses) {
        arrivalTimeError.innerHTML = "Arrival time count does not match no. of processes";
        arrivalTimes.classList.add('shake');

    } else if (/\s/.test(arrivalTimes.value)) {
        arrivalTimeError.innerHTML = "Please remove spaces between arrival times";
        arrivalTimes.classList.add('shake');

    } else if (hasNegativeValue(allArrivalTimes)) {
        arrivalTimeError.innerHTML = "Please enter positive arrival time";
        arrivalTimes.classList.add('shake');

    } else {
        arrivalTimeError.innerHTML = "";
        validationFlag++;
    }

    //Validate input for burst times
    if (burstTimes.value == "") {
        burstTimeError.innerHTML = "Please enter the burst times";
        burstTimes.classList.add('shake');

    } else if (allBurstTimes.length != numProcesses) {
        burstTimeError.innerHTML = "Burst time count does not match no. of processes";
        burstTimes.classList.add('shake');
    
    } else if (/\s/.test(burstTimes.value)) {
        burstTimeError.innerHTML = "Please remove spaces between burst times";
        burstTimes.classList.add('shake');
    
    } else if (hasNegativeValue(allBurstTimes)) {
        burstTimeError.innerHTML = "Please enter positive burst time";
        burstTimes.classList.add('shake');
    
    } else {
        burstTimeError.innerHTML = "";
        validationFlag++;
    }

    //If all flags are true, then run the simulation
    if (validationFlag != 3) {
        return
    }


    let processes = [];
    for (var i = 0; i < numProcesses; i++) {
        processes.push({
            process_id: i + 1,
            arrival_time: allArrivalTimes[i],
            burst_time: allBurstTimes[i],
            remaining_time: allBurstTimes[i],
            completion_time: 0,
            turnaround_time: 0,
            waiting_time: 0
        });
    }

    let ganttChart = [];
    let currentTime = 0;
    let completedProcesses = [];

    while (true) {
        var remainingProcesses = processes.filter(p => p.remaining_time > 0);

        if (remainingProcesses.length === 0) {
            break;
        }

        var eligibleProcesses = remainingProcesses.filter(p => p.arrival_time <= currentTime);
        
        if (eligibleProcesses.length === 0) {
            ganttChart.push({ process_id: 'Idle', time: 1 });
            currentTime++;
            continue;
        }

        var shortestProcess = eligibleProcesses.reduce((a, b) => a.remaining_time < b.remaining_time ? a : b);
        shortestProcess.remaining_time--;

        ganttChart.push({ process_id: shortestProcess.process_id, time: '|' });
        currentTime++;

        if (shortestProcess.remaining_time === 0) {
            shortestProcess.completion_time = currentTime;
            shortestProcess.turnaround_time = shortestProcess.completion_time - shortestProcess.arrival_time;
            shortestProcess.waiting_time = shortestProcess.turnaround_time - shortestProcess.burst_time;
            completedProcesses.push(shortestProcess);
        }
    }

    displayGanttChart(ganttChart);
    displayTable(completedProcesses);
    displayAverages(completedProcesses);

}

function displayGanttChart(ganttChart) {
    var ganttContainer = document.getElementById('gantt-container');
    ganttContainer.innerHTML = '';

    var table = document.createElement('table');
    table.classList.add('gantt-table');

    var processesRow = table.insertRow();
    processesRow.classList.add('processes-row');
    var timeLabelsRow = table.insertRow();
    timeLabelsRow.classList.add('time-labels-row');

    var currentTime = 0;

    ganttChart.forEach(function (entry) {
        var processCell = processesRow.insertCell();
        processCell.innerHTML = entry.process_id;

        var timeLabelsCell = timeLabelsRow.insertCell();
        timeLabelsCell.innerHTML = currentTime;

        currentTime += entry.time === '|' ? 1 : entry.time;
    });

    // Add the last time label for the completion time of the last process
    var lastTimeLabelCell = timeLabelsRow.insertCell();
    lastTimeLabelCell.innerHTML = currentTime;

    // Clear existing content in the container before appending the new table
    ganttContainer.innerHTML = '';
  
    var ganttLabel = document.createElement('p');
	  ganttLabel.style.color = 'white';
	  ganttLabel.style.fontFamily = 'Montserrat, sans-serif';
    ganttLabel.innerHTML = `<strong>Timeline: </strong>`;
  
    ganttContainer.appendChild(ganttLabel);
    ganttContainer.appendChild(table);
}

function displayTable(processes) {
    var resultContainer = document.getElementById('result-container');
    resultContainer.innerHTML = '';
  
  	var labelRow = document.createElement('p');
	  labelRow.style.color = 'white';
	  labelRow.style.fontFamily = 'Montserrat, sans-serif';
    labelRow.innerHTML = `<strong>Table Summary: </strong>`;
    resultContainer.appendChild(labelRow);

    processes.sort((a, b) => a.process_id - b.process_id);

    var table = document.createElement('table');
    table.classList.add('result-table');

    var headerRow = table.insertRow();
    headerRow.innerHTML =
        '<th>Process</th><th>Arrival Time</th><th>Burst Time</th><th>Completion Time</th><th>Turnaround Time</th><th>Waiting Time</th>';

    processes.forEach(function (p) {
        var row = table.insertRow();
        row.insertCell().innerText = p.process_id;
        row.insertCell().innerText = p.arrival_time;
        row.insertCell().innerText = p.burst_time;
        row.insertCell().innerText = p.completion_time;
        row.insertCell().innerText = p.turnaround_time;
        row.insertCell().innerText = p.waiting_time;
    });

    resultContainer.appendChild(table);
}

function displayAverages(processes) {
    var averageContainer = document.getElementById('average-container');
    averageContainer.innerHTML = '';

    var averageTurnaroundTime = processes.reduce((sum, p) => sum + p.turnaround_time, 0) / processes.length;
    var averageWaitingTime = processes.reduce((sum, p) => sum + p.waiting_time, 0) / processes.length;

	var averagesText = document.createElement('p');
	averagesText.style.color = 'white';
	averagesText.style.fontFamily = 'Montserrat, sans-serif';
    averagesText.innerHTML = `<strong>Average Turnaround Time: </strong> ${averageTurnaroundTime.toFixed(2)} <br><strong>Average Waiting Time: </strong> ${averageWaitingTime.toFixed(2)}`;

    averageContainer.appendChild(averagesText);
}


// Add a reset function
function resetScheduler() {
    location.reload();
    document.getElementById('num_processes').value = '';
    document.getElementById('all_arrival_times').value = '';
    document.getElementById('all_burst_times').value = '';

    // Clear existing results and charts
    document.getElementById('gantt-container').innerHTML = '';
    document.getElementById('result-container').innerHTML = '';
    document.getElementById('average-container').innerHTML = '';
}

// Check if arr has negative value
function hasNegativeValue(arr) {
    // Use the some method to check if any element is negative
    return arr.some(function (element) {
        return element < 0;
    });
}

// Pages
var homeLink = document.querySelectorAll('.home');
var aboutLink = document.querySelectorAll('.about');
var membersLink = document.querySelectorAll('.members');

//Page Transition
function pageTransition(link) {
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