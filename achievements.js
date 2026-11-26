const ACHIEVEMENTS = [
  {
    id: "first_game",
    title: "First Game",
    description: "Play your first game",
    check: stats => stats.totalGames >= 1
  },
  {
    id: "first_win",
    title: "First Win",
    description: "Win your first game",
    check: stats => stats.wins >= 1
  },
  {
    id: "rookie",
    title: "Rookie Player",
    description: "Play 10 games",
    check: stats => stats.totalGames >= 10
  },
  {
    id: "winner_5",
    title: "Five Wins",
    description: "Win 5 games",
    check: stats => stats.wins >= 5
  },
  {
    id: "jackpot",
    title: "Big Winner",
    description: "Get a net win of 500 coins or more",
    check: stats => stats.biggestWin >= 500
  },
  {
    id: "all_games",
    title: "Game Explorer",
    description: "Play all three games",
    check: stats =>
      stats.perGame &&
      stats.perGame.slots >= 1 &&
      stats.perGame.dice >= 1 &&
      stats.perGame.cards >= 1
  }
];

function getUnlockedAchievements() {
  try {
    return JSON.parse(
      localStorage.getItem("demoCasinoAchievements") || "{}"
    );
  } catch (error) {
    return {};
  }
}

function unlockAchievement(id) {
  const unlocked = getUnlockedAchievements();

  if (unlocked[id]) return false;

  unlocked[id] = {
    unlocked: true,
    at: Date.now()
  };

  localStorage.setItem(
    "demoCasinoAchievements",
    JSON.stringify(unlocked)
  );

  const achievement = ACHIEVEMENTS.find(item => item.id === id);

  if (achievement) {
    alert("🏆 Achievement Unlocked: " + achievement.title);
  }

  return true;
}

function checkAchievements() {
  if (typeof getStats !== "function") return;

  const stats = getStats();

  ACHIEVEMENTS.forEach(achievement => {
    if (achievement.check(stats)) {
      unlockAchievement(achievement.id);
    }
  });
}

function renderAchievementsPage() {
  const container = document.getElementById("achievementsList");
  if (!container) return;

  const unlocked = getUnlockedAchievements();

  container.innerHTML = "";

  ACHIEVEMENTS.forEach(achievement => {
    const isUnlocked = Boolean(unlocked[achievement.id]);

    const card = document.createElement("div");
    card.className = isUnlocked
      ? "achievement unlocked"
      : "achievement locked";

    const title = document.createElement("h3");
    title.textContent = (isUnlocked ? "🏆 " : "🔒 ") + achievement.title;

    const description = document.createElement("p");
    description.textContent = achievement.description;

    const status = document.createElement("small");
    status.textContent = isUnlocked ? "Unlocked" : "Locked";

    card.append(title, description, status);
    container.appendChild(card);
  });
}
