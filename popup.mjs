// Wait until the popup window has fully loaded
$(window).load(function(){
    var x2js = new X2JS();
    const exportTournament = document.getElementById("exportTournament");
    let tournamentXMLraw;

    $("#xmlArea").val("<root><child><textNode>First &amp; Child</textNode></child><child><textNode>Second Child</textNode></child><testAttrs attr1='attr1Value'/></root>");
    convertXml2JSon();
    convertJSon2XML();
    
    $("#convertToJsonBtn").click(convertXml2JSon);
    $("#convertToXmlBtn").click(convertJSon2XML);

    const load = document.getElementById("load");
    load.onchange = importFileAndSendPlayers;

    exportTournament.onclick = function (e) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "exportTournament", data: null });
        });          
    }
    function convertXml2JSon() {
        $("#jsonArea").val(JSON.stringify(x2js.xml_str2json($("#xmlArea").val()), null, 4));
    }
    function convertJSon2XML() {
        $("#xmlArea").val(x2js.json2xml_str($.parseJSON($("#jsonArea").val())));
    }

    async function importFileAndSendPlayers(e) {
        await loadFile(e);
        $("#xmlArea").val(tournamentXMLraw);
        convertXml2JSon();
        SendPlayers();
    }
    function SendPlayers() {
        const tournamentObject = $.parseJSON($("#jsonArea").val());

        const players = Array.isArray(tournamentObject.tournament.players.player)
            ? tournamentObject.tournament.players.player
            : [tournamentObject.tournament.players.player];
        
        console.log(players);
        console.log(Array.isArray(players));

        for (let player of players) {
            console.log(player._userid + ", " + player.firstname + " " + player.lastname + ", " + player.birthdate.slice(-4));
        }
        // Send a message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "playersRead", data: players });
        });
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
});
