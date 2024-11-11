//Error Messages
var processCountError = document.getElementById('processCountError');
var arrivalTimeError = document.getElementById('arrivalTimeError');
var burstTimeError = document.getElementById('burstTimeError');
var priorityError = document.getElementById('priorityError');

//Input Fields
var arrivalTimes = document.getElementById('arrivalInput');
var inputProcess = document.getElementById('processInput');
var burstTimes = document.getElementById('burstInput');
var priorities = document.getElementById('priorityInput');


function clearTable() {
  document.getElementById("result_table").innerHTML = "";
  document.getElementById("result_avgTAT").innerHTML = "";
  document.getElementById("result_avgWT").innerHTML = "";

  document.getElementById("timeline_title").innerHTML = "";
  document.getElementById("timeline").innerHTML = "";
}

// Check if arr has negative value
function hasNegativeValue(arr) {
  // Use the some method to check if any element is negative
  return arr.some(function (element) {
    return element < 0;
  });
}

document.addEventListener("DOMContentLoaded", function () {
  class NonPreemptivePriority {
    constructor(processes, arrivalTime, burstTime, priority) {
      this.processes = processes;
      this.arrivalTime = arrivalTime;
      this.burstTime = burstTime;
      this.priority = priority;
      this.numberOfProcesses = this.processes.length;
      this.endTime = [];
      this.waitingTime = [];
      this.turnAroundTime = [];
      this.avgWaitingTime = 0;
      this.avgTurnAroundTime = 0;

      this.init();
    }

    sortAccordingArrivalTimeAndPriority() {
      let temp = 0;
      let strTemp = "";

      for (let i = 0; i < this.numberOfProcesses; i++) {
        for (let j = 0; j < this.numberOfProcesses - i - 1; j++) {
          if (this.arrivalTime[j] > this.arrivalTime[j + 1]) {
            //swapping arrival time
            temp = this.arrivalTime[j];
            this.arrivalTime[j] = this.arrivalTime[j + 1];
            this.arrivalTime[j + 1] = temp;

            //swapping burst time
            temp = this.burstTime[j];
            this.burstTime[j] = this.burstTime[j + 1];
            this.burstTime[j + 1] = temp;

            //swapping priority
            temp = this.priority[j];
            this.priority[j] = this.priority[j + 1];
            this.priority[j + 1] = temp;

            //swapping process identity
            strTemp = this.processes[j];
            this.processes[j] = this.processes[j + 1];
            this.processes[j + 1] = strTemp;
          }

          //sorting according to priority when arrival timings are same
          if (this.arrivalTime[j] == this.arrivalTime[j + 1]) {
            if (this.priority[j] > this.priority[j + 1]) {
              //swapping arrival time
              temp = this.arrivalTime[j];
              this.arrivalTime[j] = this.arrivalTime[j + 1];
              this.arrivalTime[j + 1] = temp;

              //swapping burst time
              temp = this.burstTime[j];
              this.burstTime[j] = this.burstTime[j + 1];
              this.burstTime[j + 1] = temp;

              //swapping priority
              temp = this.priority[j];
              this.priority[j] = this.priority[j + 1];
              this.priority[j + 1] = temp;

              //swapping process identity
              strTemp = this.processes[j];
              this.processes[j] = this.processes[j + 1];
              this.processes[j + 1] = strTemp;
            }
          }
        }
      }
    }

    priorityNonPreemptiveAlgo() {
      //calculating waiting & turn-around time for each process
      this.endTime[0] = this.arrivalTime[0] + this.burstTime[0];
      this.turnAroundTime[0] = this.endTime[0] - this.arrivalTime[0];
      this.waitingTime[0] = this.turnAroundTime[0] - this.burstTime[0];

      for (let i = 1; i < this.numberOfProcesses; i++) {
        this.endTime[i] = this.burstTime[i] + this.endTime[i - 1];
        this.turnAroundTime[i] = this.endTime[i] - this.arrivalTime[i];
        this.waitingTime[i] = this.turnAroundTime[i] - this.burstTime[i];
      }

      let totalWaitingTime = this.waitingTime.reduce((acc, wt) => acc + wt, 0);
      let totalTurnAroundTime = this.turnAroundTime.reduce(
        (acc, tat) => acc + tat,
        0
      );

      this.avgWaitingTime = totalWaitingTime / this.numberOfProcesses;
      this.avgTurnAroundTime = totalTurnAroundTime / this.numberOfProcesses;
    }

    buildTable() {
      const table = document.createElement("table");
      const header = table.createTHead();
      const headerRow = header.insertRow(0);
      const headers = [
        "Process ID",
        "Arrival Time",
        "Burst Time",
        "Priority",
        "End Time",
        "Turnaround Time",
        "Waiting Time"
      ];

      // Create headers
      headers.forEach((headerText, index) => {
        const th = document.createElement("th");
        th.appendChild(document.createTextNode(headerText));
        headerRow.appendChild(th);
      });

      const body = table.createTBody();

      for (let i = 0; i < this.numberOfProcesses; i++) {
        const row = body.insertRow(i);

        [
          this.processes,
          this.arrivalTime,
          this.burstTime,
          this.priority,
          this.endTime,
          this.turnAroundTime,
          this.waitingTime
        ].forEach((data, index) => {
          const cell = row.insertCell(index);
          cell.appendChild(document.createTextNode(data[i]));
        });
      }

      const resTable = document.getElementById("result_table");
      resTable.appendChild(table);

      // Calculate the average waiting time and average turnaround time
      const avgWaitingTimeElement = document.getElementById("result_avgWT");
      const avgTurnaroundTimeElement = document.getElementById("result_avgTAT");

      avgWaitingTimeElement.textContent = `Average Waiting Time: ${this.avgWaitingTime.toFixed(2)}`;
      avgTurnaroundTimeElement.textContent = `Average Turnaround Time: ${this.avgTurnAroundTime.toFixed(2)}`;

      // Display averages in the result_averages element
      const resultAverages = document.getElementById("result_averages");
      resultAverages.appendChild(avgWaitingTimeElement);
      resultAverages.appendChild(avgTurnaroundTimeElement);
    }

    displayTimeline() {
      var timeline_title = document.getElementById("timeline_title");
      timeline_title.innerHTML = `Timeline`;
      var timeline = document.getElementById("timeline");

      this.endTime.unshift(0);

      const sortedEndTime = [...this.endTime].sort((a, b) => a - b);

      var ul = document.createElement("ul");
      ul.setAttribute("class", "contents");
      var div = document.createElement("div");
      div.setAttribute("class", "flex flex-row");

      for (let i = 0; i < this.numberOfProcesses; i++) {
        const processIndex = this.endTime.indexOf(sortedEndTime[i]);
        var li = document.createElement("li");
        li.setAttribute("class", "w-8 border-timeline");
        li.innerHTML = `${this.processes[processIndex]}`;
        ul.appendChild(li);
      }

      timeline.appendChild(div);
      div.appendChild(ul);

      var ul = document.createElement("ul");
      ul.setAttribute("class", "contents");
      var div = document.createElement("div");
      div.setAttribute("class", "flex flex-row");

      for (let i = 0; i < sortedEndTime.length; i++) {
        var li = document.createElement("li");
        li.setAttribute("class", "w-8");
        li.style.width = "10rem";
        li.innerHTML = `${sortedEndTime[i]}`;
        ul.appendChild(li);
      }

      timeline.appendChild(div);
      div.appendChild(ul);
    }

    init() {
      this.sortAccordingArrivalTimeAndPriority();
      this.priorityNonPreemptiveAlgo();
      this.buildTable();
      this.displayTimeline();
    }
  }

  const resetButton = document.getElementById("resetButton");

  resetButton.textContent = "Reset";
  resetButton.addEventListener("click", function () {
    location.reload();
    document.getElementById("result_table").innerHTML = "";
    document.getElementById("result_avgTAT").innerHTML = "";
    document.getElementById("result_avgWT").innerHTML = "";

    document.getElementById("timeline_title").innerHTML = "";
    document.getElementById("timeline").innerHTML = "";

    document.getElementById("processInput").value = "";
    document.getElementById("arrivalInput").value = "";
    document.getElementById("burstInput").value = "";
    document.getElementById("priorityInput").value = "";
  });

  const submitButton = document.getElementById("submitButton");

  submitButton.addEventListener("click", function () {
    let validationFlag = 0;
    clearTable();

    console.log("I am clicked");
    // submitButton.disabled = true;
    var processes = [];
    const process_count = document.getElementById("processInput").value;
    for (var i = 0; i < process_count; i++) {
      processes.push(i + 1);
    }
    const arrivalTime = document
      .getElementById("arrivalInput")
      .value.split(",")
      .map(Number);
    const burstTime = document
      .getElementById("burstInput")
      .value.split(",")
      .map(Number);
    const priority = document
      .getElementById("priorityInput")
      .value.split(",")
      .map(Number);

    //Validate input for proccess count
    if (process_count == 0) {
      processCountError.innerHTML = "Please enter the number of processes";
      inputProcess.classList.add('shake');

    } else if (process_count <= 0) {
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

    } else if (arrivalTime.length != process_count) {
      arrivalTimeError.innerHTML = "Arrival time count does not match no. of processes";
      arrivalTimes.classList.add('shake');

    } else if (/\s/.test(arrivalTimes.value)) {
      arrivalTimeError.innerHTML = "Please remove spaces between arrival times";
      arrivalTimes.classList.add('shake');

    } else if (hasNegativeValue(arrivalTime)) {
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

    } else if (burstTime.length != process_count) {
      burstTimeError.innerHTML = "Burst time count does not match no. of processes";
      burstTimes.classList.add('shake');

    } else if (/\s/.test(burstTimes.value)) {
      burstTimeError.innerHTML = "Please remove spaces between burst times";
      burstTimes.classList.add('shake');

    } else if (hasNegativeValue(burstTime)) {
      burstTimeError.innerHTML = "Please enter positive burst time";
      burstTimes.classList.add('shake');

    } else {
      burstTimeError.innerHTML = "";
      validationFlag++;
    }

    //Validate input for priority values
    if (priorities.value == "") {
      priorityError.innerHTML = "Please enter the burst times";
      priorities.classList.add('shake');

    } else if (priority.length != process_count) {
      priorityError.innerHTML = "Burst time count does not match no. of processes";
      priorities.classList.add('shake');

    } else if (/\s/.test(priorities.value)) {
      priorityError.innerHTML = "Please remove spaces between burst times";
      priorities.classList.add('shake');

    } else if (hasNegativeValue(priority)) {
      priorityError.innerHTML = "Please enter positive burst time";
      priorities.classList.add('shake');

    } else {
      priorityError.innerHTML = "";
      validationFlag++;
    }

    //If all flags are true, then run the simulation
    if (validationFlag != 4) {
      return
    }

    // Instantiating and running the NonPreemptivePriority simulation
    const prioritySimulator = new NonPreemptivePriority(
      processes,
      arrivalTime,
      burstTime,
      priority
    );
  });
});


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