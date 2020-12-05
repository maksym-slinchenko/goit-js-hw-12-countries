import "./css/styles.css";
import parsCountriesList from "./temlates/countries-list";
import parsSingleCountry from "./temlates/single-country";
import parslanguagesList from "./temlates/languages";
import "@pnotify/core/dist/BrightTheme.css";
import "@pnotify/core/dist/PNotify.css";

// Библиотеки
const { error } = require("@pnotify/core");

const debounce = require("lodash.debounce");

// Переменная API
const resourceUrl = "https://restcountries.eu/rest/v2/name/";

//DOM-элементы
const searchEl = document.querySelector("[data-input]");
const countriesListEl = document.querySelector("[data-list]");
const countryContainerEl = document.querySelector("[data-item]");

// Вызов фукции поиска стран по значению инпута
searchEl.addEventListener(
  "input",
  debounce(() => getCountries(), 500)
);

// Функция получения и обработки данных API
function getCountries() {
  fetch(resourceUrl + searchEl.value)
    .then((r) => r.json())
    .then((r) => {
      cleanCountriesList(countriesListEl),
        cleanCountriesList(countryContainerEl),
        chooseAndPutContentIntoHTML(r);
    })
    .catch(
      cleanCountriesList(countriesListEl),
      cleanCountriesList(countryContainerEl)
    );
}

// Функция очистки HTML для каждой итерации
function cleanCountriesList(el) {
  el.innerHTML = "";
}

// Функция наполнения HTML контентом
function putContentIntoHTML(el, foo, r) {
  el.insertAdjacentHTML("beforeend", foo(r));
}

// Функция выбора формата контента и наполнения HTML
function chooseAndPutContentIntoHTML(r) {
  if (r.length > 1 && r.length < 11) {
    putContentIntoHTML(countriesListEl, parsCountriesList, r);
  }
  if (r.length === 1) {
    putContentIntoHTML(countryContainerEl, parsSingleCountry, r);
    const languagesEl = countryContainerEl.querySelector(
      "[data-languages-list]"
    );
    putContentIntoHTML(languagesEl, parslanguagesList, r[0].languages);
  }
  if (r.length > 10) {
    error({
      text: "Too meny matches were found. Please chenge your query.",
      type: "info",
      delay: 2000,
    });
  }
  if (r.status === 404) {
    error({
      text: "No matches. Please chenge your query.",
      type: "info",
      delay: 2000,
    });
  }
}
