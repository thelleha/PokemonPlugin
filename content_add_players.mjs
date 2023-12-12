console.log("Hello World");

let tournamentXMLraw;



setTimeout(() => { // Temporary fix: Delay to allow the page to load first
    const recentPlayers = scrapePlayers('table-1');
    console.log("Recent players:", recentPlayers);

    const currentPlayers = scrapePlayers('table-2');
    console.log("Current Players:", currentPlayers);

    const pluginDiv = document.createElement('div');
    pluginDiv.id = 'Plugin';
    pluginDiv.innerHTML = '<input id="load" type="file" accept="*.tdf">';

    const accordionOpDiv = document.querySelector('.accordion-op');
    accordionOpDiv.insertAdjacentElement('afterend', pluginDiv);

    const load = document.getElementById("load");
    load.onchange = importCompareFill;
}, 2000);

async function importCompareFill(e) {
    await loadFile(e);
    console.log(tournamentXMLraw);
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