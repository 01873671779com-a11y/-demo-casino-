const USER_KEY = "demoCasinoUser";

const form = document.getElementById("loginForm");
const input = document.getElementById("usernameInput");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = input.value.trim();

  if (name.length < 2) {
    alert("কমপক্ষে ২ অক্ষরের নাম লিখ!");
    return;
  }

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({ name, joinedAt: Date.now() })
  );

  location.href = "index.html";
});
