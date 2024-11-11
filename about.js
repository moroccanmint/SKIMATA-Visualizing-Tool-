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