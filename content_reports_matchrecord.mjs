console.log("Pokémon Organizer Plugin: Roster script running...");

// Remove second <h3>, if present
const headings = document.querySelectorAll("h3");
if (headings.length > 1) {
  headings[1].remove();
}

// Find all relevant player tables
const tables = Array.from(document.querySelectorAll("table.report"));
if (tables.length < 2) {
  console.log("Only one table found; nothing to remove.");
} else {
  // Remove content between earlier tables and the next
  for (let i = 0; i < tables.length - 1; i++) {
    let current = tables[i];
    let next = tables[i + 1];

    let node = current.nextSibling;
    while (node && node !== next) {
      const toRemove = node;
      node = node.nextSibling;
      toRemove.remove();
    }
  }

  // Remove all but the last table
  for (let i = 0; i < tables.length - 1; i++) {
    tables[i].remove();
  }

  console.log("Removed all but the last MatchRecord table and cleaned up in-between content.");

  // Remove the "Flight" column if present
  const lastTable = tables[tables.length - 1];
  if (lastTable) {
    const headerCells = lastTable.querySelectorAll("thead tr th, tbody tr:first-child th");
    let flightIndex = -1;

    headerCells.forEach((th, i) => {
      const strong = th.querySelector("strong");
      if (strong && strong.textContent.trim().toLowerCase() === "flight") {
        flightIndex = i;
      }
    });

    if (flightIndex !== -1) {
      const rows = lastTable.querySelectorAll("tr");
      rows.forEach(row => {
        const cells = row.children;
        if (cells.length > flightIndex) {
          cells[flightIndex].remove();
        }
      });

      console.log(`Removed column 'Flight' at index ${flightIndex}`);
    } else {
      console.log("No 'Flight' column found.");
    }
  }
}

// Modify <h3> text: change total round count to 4
const heading = document.querySelector("h3");
if (heading) {
  heading.textContent = heading.textContent.replace(/(Round\s+\d+)\/\d+/, "$1/4");
  console.log("Updated round total to 4 in heading.");
}
