console.log("Gotta Catch 'Em All");

/* setTimeout(() => { // Temporary fix: Delay to allow the page to load first
// $(window).load(function(){
    console.log("Delayed execution");
    main();
// });
}, 10000); */

// content_my_tournaments.mjs
// Listen for messages from the popup or other parts of the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === "exportTournament") {main();}
});


function main() {
    const tournamentName = getTournamentName();
    const tournamentID = getTournamentID();
    const tournamentMode = getTournamentMode();
    const organizerInfo = getOrganizerInfo();
    const gameType = getGameType();
    const formattedDate = todayMMDDYYYY();

    const XMLtext = makeXMLtext({
        gameType,
        tournamentMode,
        tournamentName,
        tournamentID,
        organizerInfo,
        formattedDate
    });

    console.log(XMLtext);

    // Use Chrome API to open save file dialogue, to save XMLtext as UTF-8
    // sugested fileName = "${tournamentName}_${tournamentID}.TDF"
    const fileName = `${tournamentName}_${tournamentID}.TDF`;
    saveTextFile(XMLtext, fileName);
}

function getGameType() {
    const tournamentInfoProductDiv = document.querySelector('div[data-testid="details-tournament-info-product"]');
    if (tournamentInfoProductDiv) {
        const innerHTML = tournamentInfoProductDiv.innerHTML.trim().toLowerCase();

        if (innerHTML === "trading card game") {
            return "TRADING_CARD_GAME";
        } else if (innerHTML === "video game") {   // string to be verified
            return "VG";                           // string to be verified
        } else if (innerHTML === "go") {           // string to be verified
            return "GO";                           // string to be verified
        }
    }

    return "";
}
function getTournamentName() {
    const detailFieldName = document.querySelector('p[data-testid="detail-field-name"]');

    if (detailFieldName) {
        return detailFieldName.textContent.trim();
    } else {
        return "";
    }
}
function getTournamentID() {
    const detailFieldID = document.querySelector('div[data-testid="detail-field-id"]');

    if (detailFieldID) {
        const spansInsideDiv = detailFieldID.querySelectorAll('div > span');
        
        if (spansInsideDiv.length >= 2) {
            const firstSpanContent = spansInsideDiv[0].innerHTML.trim();
            const rawID = firstSpanContent.split(":")[1].replace(/["\s\n]/g, '');
            return rawID;
        } else {
            return "";
        }
    } else {
        return "";
    }
}
function getTournamentMode() {
    const tournamentInfoTypeDiv = document.querySelector('div[data-testid="details-tournament-info-type"]');

    if (tournamentInfoTypeDiv) {
        const mode = tournamentInfoTypeDiv.innerHTML.trim();

        switch (mode) {
            case "Custom":
                return "CUSTOM";
            case "Prerelease":
                return "PRERELEASE";
            case "League Challenge":
                return "LEAGUE_CHALLENGE";
            case "League Cup":
                return "LEAGUE_CUP";
            default:
                return "";
        }
    } else {
        return "";
    }
}
function getOrganizerInfo() {
    const organizerInfoNameDiv = document.querySelector('div[data-testid="details-organizer-info-name"]');

    if (organizerInfoNameDiv) {
        const spans = organizerInfoNameDiv.querySelectorAll('span');
        
        if (spans.length >= 2) {
            const nameSpan = spans[0].innerHTML.trim();
            const name = nameSpan.split('(')[0].trim();
            const id = nameSpan.split('(')[1].replace(/\)/g, '');
            return {
                name: name,
                id: id,
            };
        }
    }

    return {
        name: "",
        id: "",
    };
}
function makeXMLtext({
    gameType,
    tournamentMode,
    tournamentName,
    tournamentID,
    organizerInfo,
    formattedDate
}) {
    return `
<?xml version="1.0" encoding="UTF-8"?>
<tournament type="2" stage="1" version="1.7" gametype="${gameType}" mode="${tournamentMode}">
	<data>
		<name>${tournamentName}</name>
		<id>${tournamentID}</id>
		<city>Kristiansand</city>
		<state></state>
		<country>Norway</country>
		<roundtime>0</roundtime>
		<finalsroundtime>0</finalsroundtime>
		<organizer popid="${organizerInfo.id}" name="${organizerInfo.name}"/>
		<startdate>${formattedDate}</startdate>
		<lessswiss>false</lessswiss>
		<autotablenumber>true</autotablenumber>
		<overflowtablestart>0</overflowtablestart>
	</data>
	<timeelapsed>0</timeelapsed>
	<players>
	</players>
	<pods>
	</pods>
	<finalsoptions>
	</finalsoptions>
</tournament>
`;
}
function saveTextFile(text, fileName) {
    const blob = new Blob([text], { type: 'text/xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the object URL to free up resources
    URL.revokeObjectURL(url);
}
function todayMMDDYYYY(){
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    return (mm + '/' + dd + '/' + yyyy);
}
