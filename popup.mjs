// Wait until the popup window has fully loaded
$(window).load(function () {
    var x2js = new X2JS(); // XML to JSON converter library
    const exportTournament = document.getElementById("exportTournament");
    let tournamentXMLraw; // Variable to store raw XML data from file input

    // Preload example XML data in the hidden text area
    $("#xmlArea").val("<root><child><textNode>First &amp; Child</textNode></child><child><textNode>Second Child</textNode></child><testAttrs attr1='attr1Value'/></root>");
    convertXml2JSon(); // Convert preloaded XML to JSON
    convertJSon2XML(); // Convert JSON back to XML

    // Add event listeners for conversion buttons
    $("#convertToJsonBtn").click(convertXml2JSon);
    $("#convertToXmlBtn").click(convertJSon2XML);

    // Handle file selection from the input element
    const load = document.getElementById("load");
    load.onchange = importFileAndSendPlayers;

    // Export tournament button - Sends message to the content script
    exportTournament.onclick = function (e) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "exportTournament", data: null });
        });
    }

    // Convert XML data in the textarea to JSON format and display it
    function convertXml2JSon() {
        $("#jsonArea").val(JSON.stringify(x2js.xml_str2json($("#xmlArea").val()), null, 4));
    }

    // Convert JSON data in the textarea back to XML format and display it
    function convertJSon2XML() {
        $("#xmlArea").val(x2js.json2xml_str($.parseJSON($("#jsonArea").val())));
    }

    // Handles file input, loads its contents, and sends player data to the content script
    async function importFileAndSendPlayers(e) {
        await loadFile(e); // Read the selected file
        $("#xmlArea").val(tournamentXMLraw); // Store raw XML data in the hidden textarea
        convertXml2JSon(); // Convert XML to JSON for further processing
        SendPlayers(); // Extract player data and send it to the content script
    }

    // Extracts player data from JSON and sends it to the content script
    function SendPlayers() {
        const tournamentObject = $.parseJSON($("#jsonArea").val()); // Parse JSON data

        // Ensure players data is always treated as an array
        const players = Array.isArray(tournamentObject.tournament.players.player)
            ? tournamentObject.tournament.players.player
            : [tournamentObject.tournament.players.player];

        // Debug output for verification
        console.log(players);
        console.log("Is array:", Array.isArray(players));

        // Log player details
        for (let player of players) {
            console.log(player._userid + ", " + player.firstname + " " + player.lastname + ", " + player.birthdate.slice(-4));
        }

        // Send extracted player data to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "playersRead", data: players });
        });
    }

    // Reads the content of the selected file
    function loadFile(e) {
        return new Promise((resolve, reject) => {
            const file = e.target.files[0]; // Get selected file

            if (!file) {
                console.error("No file selected");
                reject("No file selected");
                return;
            }

            let reader = new FileReader();
            reader.readAsText(file, "UTF-8"); // Read file as text

            reader.onload = (e) => {
                tournamentXMLraw = e.target.result; // Store file content in variable
                resolve();
            };

            reader.onerror = (error) => {
                console.error("Error loading file:", error);
                reject(error);
            };
        });
    }
});
