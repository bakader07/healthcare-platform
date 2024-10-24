/*document.addEventListener('DOMContentLoaded', function() {
    const fileList = document.getElementById('fileList');
    const selectedItem = document.getElementById('selectedItem');

    // Sample data for the list
    const files = ['File1.txt', 'File2.jpg', 'File3.pdf', 'File4.doc'];

    // Display the list
    files.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = file;
        listItem.setAttribute('data-index', index);
        fileList.appendChild(listItem);

        listItem.addEventListener('click', function(event) {
            //const selectedIndex = this.getAttribute('data-index');
            //selectedItem.textContent = `Selected Item: ${files[selectedIndex]}`;
            var selectedFile = event.target.textContent;
            window.location.href = 'photo.html?file=' + encodeURIComponent(selectedFile);

        });
    });
}); **/
// list.js

document.addEventListener('DOMContentLoaded', function() {
    const fileListContainer = document.getElementById('fileList');

    // Retrieve the file names from the query parameter
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const encodedFileNames = urlParams.get('fileNames');
    const files = ['File1.txt', 'File2.jpg', 'File3.pdf', 'File4.doc'];

    // Display the list
    files.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = file;
        listItem.setAttribute('data-index', index);
        fileList.appendChild(listItem);
        listItem.addEventListener('click', function(event) {
            //const selectedIndex = this.getAttribute('data-index');
            //selectedItem.textContent = `Selected Item: ${files[selectedIndex]}`;
            var selectedFile = event.target.textContent;
            window.location.href = 'photo.html?file=' + encodeURIComponent(selectedFile);

        });
    });
    if (encodedFileNames) {
        // Decode the file names and parse JSON
        const fileNames = JSON.parse(decodeURIComponent(encodedFileNames));

        // Create an unordered list element
        const fileList = document.createElement('ul');

        // Loop through the file names and create list items
        for (let i = 0; i < fileNames.length; i++) {
            const listItem = document.createElement('li');
            listItem.textContent = fileNames[i];
            fileList.appendChild(listItem);
            listItem.addEventListener('click', function(event) {
                //const selectedIndex = this.getAttribute('data-index');
                //selectedItem.textContent = `Selected Item: ${files[selectedIndex]}`;
                var selectedFile = event.target.textContent;
                window.location.href = 'photo.html?file=' + encodeURIComponent(selectedFile);

            });
        }

        // Append the list to the container
        fileListContainer.appendChild(fileList);
    }


});