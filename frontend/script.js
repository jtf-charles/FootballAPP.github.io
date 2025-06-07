let allCompetitions = [];
let currentSeason = "";
let currentCode = "";
let currentName = "";

const competitionList = document.getElementById("competition-list");
const standingsTitle = document.getElementById("standings-title");
const standingsTable = document.querySelector("#standings-table tbody");
const standingsSection = document.getElementById("standings-section");
const seasonSelect = document.getElementById("season-select");
const searchInput = document.getElementById("search-input");
const closeBtn = document.getElementById("close-standings");

// Cacher le classement au départ
standingsSection.classList.add("hidden");

searchInput.addEventListener("input", (e) => {
  const query = e.target.value.trim().toLowerCase();

  if (query === "") {
    competitionList.innerHTML = ""; // Efface tout si vide
    return;
  }

  const filtered = allCompetitions.filter(c =>
    c.name.toLowerCase().includes(query)
  );

  renderCompetitions(filtered);
});

closeBtn.addEventListener("click", () => {
  standingsSection.classList.add("hidden");
});

fetch("http://localhost:3001/competitions")
  .then(res => res.json())
  .then(data => {
    allCompetitions = data.competitions;
    const premierLeague = allCompetitions.find(c => c.code === "PL");
    renderCompetitions([premierLeague]); // Premier League par défaut
  });

function renderCompetitions(competitions) {
  competitionList.innerHTML = "";
  competitions.forEach(comp => {
    const card = document.createElement("div");
    card.className = "card";

    const logo = document.createElement("img");
    logo.src = comp.emblem;
    logo.alt = comp.name;
    logo.title = `Pays : ${comp.area.name}`;

    const title = document.createElement("h3");
    title.textContent = comp.name;

    const code = document.createElement("p");
    code.innerHTML = `<strong>Code:</strong> ${comp.code}`;

    const btn = document.createElement("button");
    btn.textContent = "Voir classement";
    btn.addEventListener("click", () => {
      currentCode = comp.code;
      currentName = comp.name;
      loadStandings(currentCode, currentName);
    });

    card.appendChild(logo);
    card.appendChild(title);
    card.appendChild(code);
    card.appendChild(btn);
    competitionList.appendChild(card);
  });
}

function loadStandings(code, name, season = null) {
  let url = `http://localhost:3001/standings/${code}`;
  if (season) url += `?season=${season}`;

  fetch(url)
    .then(res => res.json())
    .then(data => {
      if (!data.standings || data.standings.length === 0) {
        standingsTable.innerHTML = `<tr><td colspan="3">Aucun classement disponible</td></tr>`;
        return;
      }

      const year = season || (data.season?.startDate?.slice(0, 4) || "2023");
      currentSeason = year;

      standingsTitle.textContent = `🏆 ${name} - Saison ${year}`;
      populateSeasonDropdown(code, name, year);
      renderStandings(data.standings[0].table);
      standingsSection.classList.remove("hidden");
    })
    .catch(err => {
      standingsTable.innerHTML = `<tr><td colspan="3">Erreur de chargement</td></tr>`;
    });
}

function renderStandings(teams) {
  standingsTable.innerHTML = "";
  teams.forEach(team => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${team.position}</td>
      <td>${team.team.name}</td>
      <td>${team.points}</td>
    `;
    standingsTable.appendChild(row);
  });
}

function populateSeasonDropdown(code, name, selectedYear) {
  seasonSelect.innerHTML = "";
  for (let y = 2024; y >= 2020; y--) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y == selectedYear) opt.selected = true;
    seasonSelect.appendChild(opt);
  }

  seasonSelect.onchange = () => {
    const selected = seasonSelect.value;
    loadStandings(code, name, selected);
  };
}
