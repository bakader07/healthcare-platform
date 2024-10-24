// script.js

function uploadAndShowText() {
    // Get the file input element
    const fileInput = document.getElementById('fileInput');

    // Get the uploaded file
    const file = fileInput.files[0];

    // Display the uploaded photo
    displayPhoto(file);

    // Show text when the button is clicked
    showText();
}

function displayPhoto(file) {
    // Get the image element
    const imgElement = document.getElementById('uploadedPhoto');

    // Create a FileReader to read the file
    const reader = new FileReader();

    reader.onload = function(e) {
        // Set the source of the image to the file's data URL
        imgElement.src = e.target.result;
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);
}

function showText() {
    // Get the text container element
    const textContainer = document.getElementById('displayText');

    // Create and append a text element
    const textElement = document.createElement('p');
    textElement.textContent = 'Result';
    textContainer.innerHTML = ''; // Clear previous text
    textContainer.appendChild(textElement);
}