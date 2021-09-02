let now = new Date();
let h2 = document.querySelector("h2");
let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDay = days[now.getDay()];
let months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let month = months[now.getMonth()];
let date = now.getDate();
let year = now.getFullYear();
let hours = now.getHours();
if (hours < 10) {
  hours = 0 + hours;
}
let setTimes = ["00", "01", "02", "03", "04", "05", "06", "07", "08", "09"];
let minutes = now.getMinutes();
if (minutes < 10) {
  minutes = setTimes[now.getMinutes()];
}
h2.innerHTML =
  currentDay +
  " " +
  month +
  ". " +
  date +
  ", " +
  year +
  " " +
  hours +
  ":" +
  minutes;

function search(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#enterCity");
  let apiKey = "7bab658d5de8c5edabc13edc502ddea0";
  let city = `${searchInput.value}`;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}
let form = document.querySelector("#search-form");
form.addEventListener("submit", search);

function showTemperature(response) {
  let temperature = Math.round(response.data.main.temp);
  let city = response.data.name;
  let h1 = document.querySelector("#temperature");
  h1.innerHTML = `${temperature}`;
  let h3 = document.querySelector("#place");
  h3.innerHTML = `${city}`;
}

function currentPosition(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiKey = "7bab658d5de8c5edabc13edc502ddea0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric`;
  axios.get(`${apiUrl}&appid=${apiKey}`).then(showTemperature);
}

function getCurrLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(currentPosition);
}

let currButton = document.querySelector("#currentPosition");
currButton.addEventListener("click", getCurrLocation);

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastHTML = `<div class="row forecastContainer">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-2">
        <div class="forecast-day">${formatDay(forecastDay.dt)}</div> 
        <img src="http://openweathermap.org/img/wn/${
          forecastDay.weather[0].icon
        }@2x.png" alt="icon" width="42"/>
        <div class="forecast-temp">
          <span class="forecast-temp-max" id="max">${Math.round(
            forecastDay.temp.max
          )}º</span>
          <span class="forecast-temp-min" id="min">${Math.round(
            forecastDay.temp.min
          )}º</span>
        </div>
      </div>
    `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  document.querySelector("#forecast").innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "7bab658d5de8c5edabc13edc502ddea0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&exclude={part}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayWeather(response) {
  let temperature = Math.round(response.data.main.temp);
  document.querySelector("temperature").innerHTML = temperature;
  document.querySelector("h3").innerHTML = response.data.name;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("wind").innerHTML = Math.round(
    response.data.wind.speed
  );
  document
    .querySelector("#currentIcon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  getForecast(response.data.coord);
}
