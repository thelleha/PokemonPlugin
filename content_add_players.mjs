console.log("Gotta Catch 'Em All");
const REPORTING_FORM_FULL_ERROR = -1;
let playersData = [];


// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "playersRead") {

        // Access the received data
        playersData = message.data;
        // console.log('Received players data:', playersData);
        main (playersData)

        // You can perform further actions with the data as needed
    }
});


function main(tournamentPlayers) {
    // Scrape recent players from table-1
    const recentPlayers = scrapePlayers('table-1');
    // console.log("Recent players:", recentPlayers);

    // Scrape current players from table-2
    const currentPlayers = scrapePlayers('table-2');
    // console.log("Current Players:", currentPlayers);

    // Label for the outer loop
    mainLoop:
    for (const player of tournamentPlayers) {
        // Log player information
        console.log(
            player._userid + ", " +
            player.firstname + " " +
            player.lastname + ", " +
            player.birthdate.slice(-4)
        );

        // Check if the player is active
        if (currentPlayers && currentPlayers.includes(player._userid)) {
            console.log("Player is active");
        }
        // Check if the player was recently active
        else if (recentPlayers && recentPlayers.includes(player._userid)) { // "&& false" to be removed after development
            addPastPlayer(player._userid);
        }
        // If the player is neither current nor recent, consider them a new player
        else {
            console.log("New player");
            const result = addNewPlayer(player);

            if (result === REPORTING_FORM_FULL_ERROR) {
                console.error("Error: Reporting Form is full. Please handle accordingly.");
                alert("Reporting Form is full. Please handle accordingly.");
                // Stop the iteration by breaking out of the labeled loop
                break mainLoop;
            } else if (result === null) {
                console.log("No error. Reporting Form successfully processed.");
            } else {
                console.error("Unexpected error:", result);
            }
        }
    }
}


function addNewPlayer(player){
    // Check and fill the reporting form inputs
    const reportingFormIds = ["id_form-0-pop_id", "id_form-1-pop_id", "id_form-2-pop_id", "id_form-3-pop_id"];
    const reportingFormFirstNames = ["id_form-0-first_name", "id_form-1-first_name", "id_form-2-first_name", "id_form-3-first_name"];
    const reportingFormLastNames = ["id_form-0-last_name", "id_form-1-last_name", "id_form-2-last_name", "id_form-3-last_name"];
    const reportingFormYears = ["id_form-0-dob", "id_form-1-dob", "id_form-2-dob", "id_form-3-dob"];
    let formFilled = false;

    for (let i = 0; i < reportingFormIds.length; i++) {
        const inputElement = document.getElementById(reportingFormIds[i]);
        const firstNameElement = document.getElementById(reportingFormFirstNames[i]);
        const lastNameElement = document.getElementById(reportingFormLastNames[i]);
        const yearElement = document.getElementById(reportingFormYears[i]);

        if (inputElement && inputElement.value.trim() === "") {
            // If the input is empty, fill it with player._userid
            inputElement.value = player._userid;

            // Assuming you have first name, last name, and year available for the player
            if (firstNameElement && lastNameElement && yearElement) {
                firstNameElement.value = player.firstname;
                lastNameElement.value = player.lastname;
                yearElement.value = player.birthdate.slice(-4);
            }

            formFilled = true;
            break; // Exit the loop once a form is filled
        }
    }

    if (!formFilled) {
        console.log("Reporting Form is full");
        return REPORTING_FORM_FULL_ERROR; // Return the error code
    }

    return null; // Return no error
}


function addPastPlayer(playerID) {
    console.log("Player was recently active");

    // Use scrapePlayers('table-1') as a reference to find the checkbox with the specified playerID
    const currentPlayers = scrapePlayers('table-1');
    const checkboxSelector = `td input[type="checkbox"][value="${playerID}"]`;

    // Find the checkbox with the specified playerID
    const checkboxElement = document.querySelector(checkboxSelector);

    if (checkboxElement) {
        // Set the checkbox to true (checked)
        checkboxElement.checked = true;
        console.log(`Checkbox for player with ID ${playerID} set to true.`);
    } else {
        console.log(`Checkbox for player with ID ${playerID} not found.`);
    }
}

function scrapePlayers(tableId) {
    const tableElement = document.querySelector(`table#${tableId}`);

    if (tableElement) {
        const tbodyElement = tableElement.querySelector('tbody');

        if (tbodyElement) {
            const trElements = tbodyElement.querySelectorAll('tr');
            const valuesArray = [];

            trElements.forEach((trElement) => {
                const checkboxTd = trElement.querySelector('td input[type="checkbox"]');

                if (checkboxTd) {
                    const checkboxValue = checkboxTd.getAttribute('value');
                    valuesArray.push(checkboxValue);
                }
            });

            return valuesArray;
        } else {
            console.log(`No <tbody> element found inside the table with id 'table-${tableId}'.`);
            return ['']; // Return an array with one empty string
        }
    } else {
        console.log(`Table with id 'table-${tableId}' not found.`);
        return ['']; // Return an array with one empty string
    }
}

