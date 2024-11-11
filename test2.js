function addDiv() {
    // Get the container
    var container = document.getElementById('container');

    // Create a new div
    var newDiv = document.createElement('div');
    newDiv.className = 'child';
    newDiv.textContent = container.children.length + 1; // Just numbering the divs

    // Add the new div to the container
    container.appendChild(newDiv);
}