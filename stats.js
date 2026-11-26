const STATS_KEY = "demoCasinoStats";

function getStats() {
  const defaults = {
    totalGames: 0,
    wins: 0,
    losses: 0,
    ties: 0,
    biggestWin: 0,
    perGame: {
      slots: 0,
      dice: 0,
      cards: 0
    }
  };

  try {
    const saved = JSON.parse(
      localStorage.getItem(STATS_KEY)
    );

    if (!saved || typeof saved !== "object") {
      return defaults;
    }

    return {
      ...defaults,
      ...saved,
      perGame: {
        ...defaults.perGame,
        ...(saved.perGame || {})
      }
    };
  } catch (error) {
    return defaults;
  }
}

function recordResult(gameName, result, winAmount = 0) {
  const validGames = ["slots", "dice", "cards"];
  const validResults = ["win", "loss", "tie"];

  if (!validGames.includes(gameName)) return;
  if (!validResults.includes(result)) return;

  const stats = getStats();

  stats.totalGames++;
  stats.perGame[gameName]++;

  if (result === "win") {
    stats.wins++;

    const profit = Number(winAmount);

    if (Number.isFinite(profit) && profit > stats.biggestWin) {
      stats.biggestWin = profit;
    }
  }

  if (result === "loss") {
    stats.losses++;
  }

  if (result === "tie") {
    stats.ties++;
  }

  localStorage.setItem(
    STATS_KEY,
    JSON.stringify(stats)
  );

  renderStatsPage();
}

function renderStatsPage() {
  const stats = getStats();

  const winRate = stats.totalGames > 0
    ? (stats.wins / stats.totalGames * 100).toFixed(1)
    : "0.0";

  const values = {
    statTotalGames: stats.totalGames,
    statWins: stats.wins,
    statLosses: stats.losses,
    statWinRate: winRate + "%",
    statBiggestWin: stats.biggestWin,
    slotsGames: stats.perGame.slots,
    diceGames: stats.perGame.dice,
    cardsGames: stats.perGame.cards
  };

  for (const [id, value] of Object.entries(values)) {
    const element = document.getElementById(id);

    if (element) {
      element.textContent = value;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderStatsPage();
});
