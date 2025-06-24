console.log("Pokémon Organizer Plugin: Roster script running...");

// Remove second <h3>, if present
const headings = document.querySelectorAll("h3");
if (headings.length > 1) {
  headings[1].remove();
}

// Find all relevant player tables
const tables = Array.from(document.querySelectorAll("table.players_table.report.border"));
if (tables.length < 2) {
  console.log("No extra tables to merge.");
} else {
  // Remove content between tables
  for (let i = 0; i < tables.length - 1; i++) {
    let current = tables[i];
    let next = tables[i + 1];

    let node = current.nextSibling;
    while (node && node !== next) {
      let toRemove = node;
      node = node.nextSibling;
      toRemove.remove();
    }
  }

  // Merge additional tables into the first one
  const mainTbody = tables[0].querySelector("tbody");
  for (let i = 1; i < tables.length; i++) {
    const rows = tables[i].querySelectorAll("tr");
    for (let j = 1; j < rows.length; j++) {
      mainTbody.appendChild(rows[j]);
    }
    tables[i].remove();
  }

  console.log("Roster tables cleaned and merged.");
}
