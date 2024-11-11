let pageFrames, fifoQueue, pageFaults, totalRequests;
let validationFlag = 0;

const animationSpeed = 1000; // in milliseconds

function startSimulation() {
    const numFrames = parseInt(document.getElementById('numFrames').value);
    const pageRequests = document.getElementById('pageRequests').value.split(',').map(Number);
    const framesContainer = document.getElementById('frames-container');

    pageFrames = Array(numFrames).fill(-1);
    fifoQueue = [];
    pageFaults = 0;
    totalRequests = pageRequests.length;

    function updateFrames() {
        framesContainer.innerHTML = '';

        for (let i = 0; i < pageFrames.length; i++) {
            const frame = document.createElement('div');
            frame.className = 'frame';

            if (pageFrames[i] !== -1) {
                frame.textContent = pageFrames[i];
            }

            framesContainer.appendChild(frame);
        }
    }

    function animateSimulation() {
        if (pageRequests.length > 0) {
            const currentPage = pageRequests.shift();
            const isPageFault = !pageFrames.includes(currentPage);

            if (isPageFault) {
                pageFaults++;

                // Highlight the page fault
                framesContainer.classList.add('new-page-fault');
                setTimeout(() => {
                    framesContainer.classList.remove('new-page-fault');
                }, animationSpeed / 2);

                if (fifoQueue.length < pageFrames.length) {
                    pageFrames[fifoQueue.length] = currentPage;
                } else {
                    const replacedPage = fifoQueue.shift();
                    const replacedPageIndex = pageFrames.indexOf(replacedPage);
                    pageFrames[replacedPageIndex] = currentPage;
                }

                fifoQueue.push(currentPage);
            }

            updateFrames();

            // Continue the animation
            setTimeout(animateSimulation, animationSpeed);
        } else {
            // Display total faults
            const successRate = ((totalRequests - pageFaults) / totalRequests) * 100;
			const failureRate = (pageFaults / totalRequests) * 100;
			document.getElementById('totalFaults').textContent = pageFaults;
            document.getElementById('successRate').textContent = successRate.toFixed(2) + '%';
            document.getElementById('failureRate').textContent = failureRate.toFixed(2) + '%';
        }
    }

    // Start the animation
    animateSimulation();
}

function resetSimulation() {
    // Reset all values
    pageFrames = [];
    fifoQueue = [];
    pageFaults = 0;

    // Clear inputs and results
    document.getElementById('numFrames').value = '';
    document.getElementById('pageRequests').value = '';
    document.getElementById('totalFaults').textContent = '0';
    document.getElementById('successRate').textContent = '0%';
    document.getElementById('failureRate').textContent = '0%';
    document.getElementById('frames-container').innerHTML = '';
}

function validateCount() {
    var numOfFrames = document.getElementById('numFrames');
    var frameCountError = document.getElementById('frameCountError');

    if (numOfFrames.value == "") {
        frameCountError.innerHTML = "Please enter the number of frames";
        numOfFrames.classList.add('shake');
        return;
    } else if (numOfFrames.value <= 0) {
        frameCountError.innerHTML = "Please enter a positive number";
        numOfFrames.classList.add('shake');
        return;
    } else {
        frameCountError.innerHTML = "";
        validationFlag++;
    }
}

function validateRequests() {
    var pageRequests = document.getElementById('pageRequests');
    var requestError = document.getElementById('requestError');

    if (pageRequests.value == "") {
        requestError.innerHTML = "Please enter the page requests";
        pageRequests.classList.add('shake');
        return;
    } else if (/\s/.test(pageRequests.value)) {
        requestError.innerHTML = "Please remove spaces between page requests";
        pageRequests.classList.add('shake');
        return;
    } else {
        requestError.innerHTML = "";
        validationFlag++;
    }
}

function run() {
    console.log(validationFlag)
    event.preventDefault();
    validateCount();
    validateRequests();
    if (validationFlag == 2) {
        startSimulation();
    } else {
        validationFlag = 0;
    }
}

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