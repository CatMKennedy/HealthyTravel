"use strict";

/* 
HealthyTravel - Walkable Cities. Currently html file displays some example cities which can be clicked
for more information, such as weather, country, population etc.

This is a small test application using vanilla js (no framework).
The goal is to explore the recent additions to javascript (such as async/await) and some public APIs.
*/

const cityText = document.querySelector(".cityInfo");
const countryText = document.querySelector(".countryInfo");
const weatherText = document.querySelector(".weatherInfo");

//Get array of buttons
let btns = [...document.getElementsByClassName("button")];

//Add event listeners to buttons
btns.forEach((btn) =>
  btn.addEventListener("click", () => {
    let [city, country] = btn.textContent.split(", ");
    getData(city, country);
  })
);

//Functions - renderData is called by getData
const renderData = function (
  cityData,
  weatherData,
  countryData,
  sunData = null
) {
  //Display city data
  cityText.textContent = `${cityData.city}, ${cityData.country}: Lat: ${cityData.lat}, Long: ${cityData.long}.`;
  cityText.style.opacity = 1;

  //Display weather data
  let text1 = `Current weather: ${weatherData.comment}, ${weatherData.temp.c}C, Precip: ${weatherData.precip}, Humidity: ${weatherData.humidity}.`;
  let text2 = sunData
    ? ` Sunrise: ${sunData.sunrise}, Sunset: ${sunData.sunset}.`
    : ` Sunrise/sunset data not available for this location `;
  weatherText.textContent = text1 + text2;
  weatherText.style.opacity = 1;

  //Display country data
  countryText.textContent = `Region: ${countryData.region}, Language: ${countryData.languages[0].name}, Currency: ${countryData.currencies[0].name}.`;
  countryText.style.opacity = 1;
};

//Get data from different APIs
const getData = async function (city, country) {
  try {
    //Get position of city
    const resCity = await fetch(`https://geocode.xyz/${city}?geoit=json`);
    if (!resCity.ok)
      throw new Error(
        `Problem getting city data - high frequency requests may be refused. Please retry`
      );
    const geoData = await resCity.json();

    //Set up city data for rendering, using lat and long from geocode data
    const cityData = {
      city: city,
      country: country,
      lat: geoData.latt,
      long: geoData.longt,
    };
   
    //Get weather data
    const resWeather = await fetch(
      `https://weatherdbi.herokuapp.com/data/weather/${city}`
    );
    if (!resWeather.ok) throw new Error(`Problem getting weather data`);
    const weatherData = await resWeather.json();

    //This is an API for sunrise and sunset - but only has data for some locations
    // const resSun = await fetch(
    //`https://api.sunrisesunset.io/json?lat=${cityData.lat}&lng=${cityData.long}&timezone=UTC&date=today`;
    //);
    //if (!resSun.ok) throw new Error(`Problem getting sunrise/sunset data`);
    //const sunData = await resSun.json();
    //console.log(sunData);

    //Get country data
    const resCountry = await fetch(
      `https://restcountries.com/v2/name/${country}`
    );
    if (!resCountry.ok)
      throw new Error(`Problem getting country data; check country name`);
    const countryData = await resCountry.json();

    //Display the data
    renderData(cityData, weatherData.currentConditions, countryData[0]);
  } catch (err) {
    console.error(`${err} **** `);

    //Could rethrow error here so that it propagates
    //throw err;
  }
};
