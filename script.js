const form = document.getElementById("statsForm");
const tableBody = document.getElementById("statsTableBody");

const gamesCountEl = document.getElementById("gamesCount");
const avgPointsEl = document.getElementById("avgPoints");
const avgReboundsEl = document.getElementById("avgRebounds");
const avgAssistsEl = document.getElementById("avgAssists");
const avgBlocksEl = document.getElementById("avgBlocks");

let stats = JSON.parse(localStorage.getItem("basketballStats")) || [];

let chart;

function saveStats() {
  localStorage.setItem("basketballStats", JSON.stringify(stats));
}

function renderTable() {
  tableBody.innerHTML = "";
  stats.forEach((game) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${game.date}</td>
      <td>${game.opponent}</td>
      <td>${game.points}</td>
      <td>${game.rebounds}</td>
      <td>${game.assists}</td>
      <td>${game.blocks}</td>
    `;
    tableBody.appendChild(row);
  });
}

function renderSummary() {
  const games = stats.length;
  gamesCountEl.textContent = games;

  if (games === 0) {
    avgPointsEl.textContent = 0;
    avgReboundsEl.textContent = 0;
    avgAssistsEl.textContent = 0;
    avgBlocksEl.textContent = 0;
    return;
  }

  const totalPoints = stats.reduce((sum, game) => sum + game.points, 0);
  const totalRebounds = stats.reduce((sum, game) => sum + game.rebounds, 0);
  const totalAssists = stats.reduce((sum, game) => sum + game.assists, 0);
  const totalBlocks = stats.reduce((sum, game) => sum + game.blocks, 0);

  avgPointsEl.textContent = (totalPoints / games).toFixed(1);
  avgReboundsEl.textContent = (totalRebounds / games).toFixed(1);
  avgAssistsEl.textContent = (totalAssists / games).toFixed(1);
  avgBlocksEl.textContent = (totalBlocks / games).toFixed(1);
}

function renderChart() {
  const labels = stats.map(game => game.date);
  const pointsData = stats.map(game => game.points);

  const ctx = document.getElementById("pointsChart").getContext("2d");

  if (chart) {
    chart.destroy();
  }

  chart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "득점",
        data: pointsData,
        borderColor: "#007aff",
        backgroundColor: "rgba(0,122,255,0.2)",
        tension: 0.3,
        fill: true
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true
        }
      }
    }
  });
}

function renderAll() {
  renderTable();
  renderSummary();
  renderChart();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newGame = {
    date: document.getElementById("date").value,
    opponent: document.getElementById("opponent").value,
    points: Number(document.getElementById("points").value),
    rebounds: Number(document.getElementById("rebounds").value),
    assists: Number(document.getElementById("assists").value),
    blocks: Number(document.getElementById("blocks").value)
  };

  stats.push(newGame);
  saveStats();
  renderAll();
  form.reset();
});

renderAll();
