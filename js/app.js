let countries = [];

const countryList = document.querySelector("#country-list");
const searchFormEl = document.querySelector("#search-form");
const regionToggle = document.querySelector("#region-toggle");
const regionOptions = document.querySelector("#region-options");
const regionButtons = document.querySelectorAll(".region-button");
const noResults = document.querySelector("#no-results");
const darkButton = document.querySelector("#dark-button");
const lightButton = document.querySelector("#light-button");

let selectedRegion = "All";
let searchText = "";

function showDarkMode() {
  document.body.classList.add("dark-mode");
  darkButton.classList.add("hidden");
  lightButton.classList.remove("hidden");
  localStorage.setItem("mode", "dark");
}

function showLightMode() {
  document.body.classList.remove("dark-mode");
  darkButton.classList.remove("hidden");
  lightButton.classList.add("hidden");
  localStorage.setItem("mode", "light");
}

function updateUi(countryData) {
  const matchingCountries = countryData.filter(function (country) {
    const matchesName = country.name.toLowerCase().includes(searchText);
    const matchesRegion =
      selectedRegion === "All" || country.region === selectedRegion;

    return matchesName && matchesRegion;
  });

  countryList.innerHTML = "";

  matchingCountries.forEach(function (country) {
    countryList.innerHTML += `
      <article class="country-card">
        <img src="${country.flag}" alt="Flag of ${country.name}" />
        <div class="country-info">
          <h2>${country.name}</h2>
          <p><strong>Population:</strong> ${country.population}</p>
          <p><strong>Region:</strong> ${country.region}</p>
          <p><strong>Capital:</strong> ${country.capital}</p>
        </div>
      </article>
    `;
  });

  noResults.hidden = matchingCountries.length > 0;
}

//api biln qilingan joy
async function getCountries() {
  try {
    const response = await fetch(
      "https://countries-api-steel-theta.vercel.app/api/countries",
    );
    if (!response.ok) {
      throw new Error("davlat olishda xato");
    }

    const data = await response.json();
    countries = data.data;
    updateUi(countries);
  } catch (error) {
    console.error(error);
  }
}

function updateSearch() {
  const formData = new FormData(searchFormEl);
  const inputValue = formData.get("search-text");
  searchText = typeof inputValue === "string" ? inputValue.toLowerCase() : "";
  updateUi(countries);
}

searchFormEl.addEventListener("input", updateSearch);

searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  updateSearch();
});

regionToggle.addEventListener("click", function () {
  regionOptions.hidden = !regionOptions.hidden;
});

regionButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    selectedRegion = button.textContent.trim();

    regionButtons.forEach(function (regionButton) {
      regionButton.classList.remove("active");
    });

    button.classList.add("active");
    regionOptions.hidden = true;
    updateUi(countries);
  });
});

darkButton.addEventListener("click", function () {
  showDarkMode();
});

lightButton.addEventListener("click", function () {
  showLightMode();
});

if (localStorage.getItem("mode") === "dark") {
  showDarkMode();
}

getCountries();
