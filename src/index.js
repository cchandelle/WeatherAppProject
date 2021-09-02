let date = new Date();
let today = date.getDate();

let hour = date.getHours();
let ampm = hour >= 12 ? "pm" : "am";
hour = hour % 12;
hour = hour ? hour : 12;

let minutes = date.getMinutes();
minutes = minutes < 10 ? "0" + minutes : minutes;
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[date.getDay()];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
let month = months[date.getMonth()];

let currentDateTime = document.querySelector("#current-info");
currentDateTime.innerHTML = `Last Updated: ${day}, ${month} ${today}  at ${hour}:${minutes} ${ampm}`;

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let dailyForecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row" >`;
  dailyForecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
      <div class="col-3" >      
                  <div class="forecast-day">${displayDay(forecastDay.dt)}</div>
                  <div class="forecast-weather-image"><img src="http://openweathermap.org/img/wn/${
                    forecastDay.weather[0].icon
                  }@2x.png" alt="Weather-Icon" id="forecast-image"/></div>
                  <div class="forecast-highlow"><span class="forecast-high">${Math.round(
                    forecastDay.temp.max
                  )}°</span><span class="forecast-low"> ${Math.round(
          forecastDay.temp.min
        )}°</span></div>   
          </div>
        `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "7bab658d5de8c5edabc13edc502ddea0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=imperial`;

  axios.get(apiUrl).then(displayForecast);
}

function displayForecastElements(response) {
  let tempElement = Math.round(response.data.main.temp);
  let insertTemp = document.querySelector("#temperature");
  insertTemp.innerHTML = `${tempElement} °`;

  let descriptionElement = response.data.weather[0].description;
  let insertDescription = document.querySelector("#current-information");
  insertDescription.innerHTML = `${descriptionElement} °F`;

  let feelsLikeElement = Math.round(response.data.main.feels_like);
  let insertFeelsLike = document.querySelector("#feels-like");
  insertFeelsLike.innerHTML = `${feelsLikeElement} `;

  let humidityElement = response.data.main.humidity;
  let insertHumidity = document.querySelector("#current-humidity");
  insertHumidity.innerHTML = `${humidityElement}%`;

  let windElement = Math.round(response.data.wind.speed);
  let insertWind = document.querySelector("#current-wind");
  insertWind.innerHTML = `${windElement} mph`;

  let highElement = Math.round(response.data.main.temp_max);
  let insertHigh = document.querySelector("#current-high");
  insertHigh.innerHTML = `${highElement} °F`;

  let lowElement = Math.round(response.data.main.temp_min);
  let insertLow = document.querySelector("#current-low");
  insertLow.innerHTML = `${lowElement} °F`;

  let name = response.data.name;
  let insertName = document.querySelector("#place");
  insertName.innerHTML = `${name}`;

  let iconElement = document.querySelector("#currentIcon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "7bab658d5de8c5edabc13edc502ddea0";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;
  axios.get(apiUrl).then(displayForecastElements);
}

function submit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#enterCity");
  search(cityInputElement.value);
}

let citySearch = document.querySelector("#searchInput");
citySearch.addEventListener("submit", handleSubmit);

function showCurrentLocation(position) {
  let apiKey = "7bab658d5de8c5edabc13edc502ddea0";
  let endpoint = "https://api.openweathermap.org/data/2.5/weather";
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "imperial";
  let apiUrl = `${endpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}`;

  axios.get(apiUrl).then(displayForecastElements);
}

function getCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showCurrentLocation);
}

let currentLocation = document.querySelector("#currentPosition");
currentLocation.addEventListener("click", getCurrentPosition);

search("Waipahu");
