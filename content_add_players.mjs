console.log("Hello World");

let tournamentXMLraw;


// Set a delay of 2 seconds before executing the code to create and inject the div
setTimeout(() => {
    // scrapePlayers();
    const recentPlayers = scrapePlayers('table-1');
    console.log("Recent players:", recentPlayers);

    const currentPlayers = scrapePlayers('table-2');
    console.log("Current Players:", currentPlayers);

    // Create a new div element
    const pluginDiv = document.createElement('div');
    
    // Set the id attribute of the new div
    pluginDiv.id = 'Plugin';
    
    // Set the innerHTML of the new div
    pluginDiv.innerHTML = '<input id="load" type="file" accept="*.tdf">';

    // Get a reference to the parent div with class "accordion-op"
    const accordionOpDiv = document.querySelector('.accordion-op');
    
    // Insert the new div below the accordion-op div
    accordionOpDiv.insertAdjacentElement('afterend', pluginDiv);

    // After inserting the div into the DOM, now you can assign the onchange event
    const load = document.getElementById("load");
    load.onchange = importCompareFill;
    

}, 2000); // 2000 milliseconds (2 seconds) delay
async function importCompareFill(e) {
    await loadFile(e);
    console.log(tournamentXMLraw);
}


function scrapePlayers(tableId) {
    // Search for the table with class "table" and the given id suffix
    const tableElement = document.querySelector(`table#${tableId}`);

    // Check if the table element is found
    if (tableElement) {
        // Get the <tbody> element inside the table
        const tbodyElement = tableElement.querySelector('tbody');

        // Check if the tbody element is found
        if (tbodyElement) {
            // Find all <tr> elements inside the tbody
            const trElements = tbodyElement.querySelectorAll('tr');

            // Create an array to store the values
            const valuesArray = [];

            // Loop through each <tr> element
            trElements.forEach((trElement) => {
                // Find the <td> element with <input> of type "checkbox" inside the <tr>
                const checkboxTd = trElement.querySelector('td input[type="checkbox"]');

                // Check if the <td> element with the checkbox is found
                if (checkboxTd) {
                    // Get the value attribute from the checkbox
                    const checkboxValue = checkboxTd.getAttribute('value');

                    // Store the value in the array
                    valuesArray.push(checkboxValue);
                }
            });

            // Return the array instead of logging it
            return valuesArray;
        } else {
            console.log(`No <tbody> element found inside the table with id 'table-${tableId}'.`);
            return null;
        }
    } else {
        console.log(`Table with id 'table-${tableId}' not found.`);
        return null;
    }
}
function loadFile(e) {
    return new Promise((resolve, reject) => {
        const file = e.target.files[0];

        if (!file) {
            console.error("No file selected");
            reject("No file selected");
            return;
        }

        let reader = new FileReader();
        reader.readAsText(file, "UTF-8");

        reader.onload = (e) => {
            tournamentXMLraw = e.target.result;
            resolve();
        };

        reader.onerror = (error) => {
            console.error("Error loading file:", error);
            reject(error);
        };
    });
}