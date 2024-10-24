/*function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');

    const files = fileInput.files;

    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Display the file in the list
        const listItem = document.createElement('li');
        listItem.textContent = file.name;
        fileList.appendChild(listItem);
    }

    // Optional: You can use the File API to upload the files to a server here.
} 
// Function to handle file upload
function uploadFiles() {
    // Get the file input element
    const fileInput = document.getElementById('upload_js');

    // Get the files selected by the user
    const files = fileInput.files;

    // Display the list of selected files
    displayFileList(files);
}

// Function to display the list of files
function displayFileList(files) {
    // Get the element where the file list will be displayed
    const fileListContainer = document.getElementById('list.js/');

    // Clear previous content
    //fileListContainer.innerHTML = '';

    // Create an unordered list element
    const fileList = document.getElementById('fileList');

    // Loop through the selected files and create list items
    for (let i = 0; i < files.length; i++) {
        const listItem = document.createElement('li');
        listItem.textContent = files[i].name;
        fileList.appendChild(listItem);
    }


} ***/
// upload_js.js

function uploadAndNavigate() {
    // Get the file input element
    const fileInput = document.getElementById('fileInput');

    // Get the files selected by the user
    const files = fileInput.files;

    // Create an array to store file names
    const fileNames = [];

    // Loop through the selected files and add their names to the array
    for (let i = 0; i < files.length; i++) {
        fileNames.push(files[i].name);
    }

    // Encode the file names as a query parameter
    const encodedFileNames = encodeURIComponent(JSON.stringify(fileNames));

    // Construct the URL with the encoded file names
    const targetPageUrl = `list.html?fileNames=${encodedFileNames}`;

    // Navigate to the target page
    window.location.href = targetPageUrl;
}