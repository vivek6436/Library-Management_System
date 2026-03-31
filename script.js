let user = localStorage.getItem("user");
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

// Auth
function signup() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  localStorage.setItem("user", u);
  localStorage.setItem("pass", p);
  alert("Signup successful");
}

function login() {
  const u = document.getElementById("username").value;
  const p = document.getElementById("password").value;

  if (u === localStorage.getItem("user") && p === localStorage.getItem("pass")) {
    document.getElementById("auth").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    document.getElementById("welcome").innerText = "Welcome " + u;
  } else {
    alert("Invalid login");
  }
}

function logout() {
  location.reload();
}

// Dark mode
function toggleDark() {
  document.body.classList.toggle("dark");
}

// Enter search
function handleEnter(e) {
  if (e.key === "Enter") searchBook();
}

// Search
async function searchBook() {
  const q = document.getElementById("search").value;
  const loader = document.getElementById("loader");
  const results = document.getElementById("results");

  results.innerHTML = "";
  loader.classList.remove("hidden");

  const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${q}`);
  const data = await res.json();

  loader.classList.add("hidden");

  if (!data.items) return (results.innerHTML = "No books");

  data.items.forEach(item => {
    const b = item.volumeInfo;

    results.innerHTML += `
      <div class="card">
        <img src="${b.imageLinks?.thumbnail || ''}" />
        <h3>${b.title}</h3>
        <button onclick='addFav(${JSON.stringify(b)})'>❤️</button>
      </div>
    `;
  });
}

// Favorites
function addFav(book) {
  favorites.push(book);
  localStorage.setItem("fav", JSON.stringify(favorites));
  displayFav();
}

function removeFav(i) {
  favorites.splice(i, 1);
  localStorage.setItem("fav", JSON.stringify(favorites));
  displayFav();
}

function displayFav() {
  const div = document.getElementById("favorites");
  div.innerHTML = "";

  favorites.forEach((b, i) => {
    div.innerHTML += `
      <div class="card">
        <h3>${b.title}</h3>
        <button onclick="removeFav(${i})">❌</button>
      </div>
    `;
  });

  document.getElementById("count").innerText = favorites.length;
}

displayFav();
