// saved auto fetch

let onloadLocationLong = 2.3399997;
let onloadLocationLat = 48.86;
let onloadLocationZone = 'Europe/Paris';


// get info holder
let daysTag = document.getElementsByClassName("forecastBoxTitle");

const searchBtn = document.getElementById("searchBtn");

const searchInp = document.getElementById("searchbox");

const searchForm = document.getElementById("searchForm");

let errorBox = document.getElementById("errorBox");

let refreshBtn = document.getElementById("refreshBtn");

let tempTag = document.getElementById("temperature");

let dailyWeatherCTags = document.getElementsByClassName("forecastPic");

let weathercodeTag = document.getElementById("weathercode");

let currentIconHeaderTag = document.getElementById("weatherIcon");

let feelslikeTag = document.getElementById("feelslike");

let humidityTag = document.getElementById("humidity");

let uvIndexTag = document.getElementById("uvIndex");

let currentSunriseTag = document.getElementById("currentSunrise");

let currentSunsetTag = document.getElementById("currentSunset");

let windSpeedTag = document.getElementById("windspeed");

let currentTimezoneTag = document.getElementById("currentTimezone");

let countryZone;

let countryHeaderTag = document.getElementById("countryHeader");

let highDailyTempTag = document.getElementsByClassName("forecastBoxTempretureHigh");

let lowDailyTempTag = document.getElementsByClassName("forecastBoxTempretureLow");

let tempChangeTags = document.getElementsByClassName("changeClass");

let checkBtn = document.getElementById("checkClassBtn");



checkBtn.addEventListener("change", () => {

    Array.from(tempChangeTags).forEach(element => {

        let value = parseFloat(element.innerText);

        if (checkBtn.checked && !element.classList.contains("fahrenheit")) {
            let f = (value * 9 / 5) + 32;
            element.innerText = f.toFixed(1) + "°F";
            element.classList.add("fahrenheit");
        }

        else if (!checkBtn.checked && element.classList.contains("fahrenheit")) {
            let c = (value - 32) * 5 / 9;
            element.innerText = c.toFixed(1) + "°C";
            element.classList.remove("fahrenheit");
        }

    });

});


document.addEventListener("DOMContentLoaded", () => {
    countryHeaderTag.innerText = `Paris, France`;
    getWeatherData(onloadLocationLat, onloadLocationLong, onloadLocationZone);
});

function textTimeOut() {
    setTimeout(() => {
        errorBox.innerText = "";
    }, 2000);
}

searchBtn.addEventListener("click", function (e) {
    e.preventDefault();

    let city = searchInp.value.trim();

    if (!city) {
        errorBox.innerText = "Please enter a city name";
        textTimeOut();
        return;
    }

    if (/^\d+$/.test(city) || /^[^a-zA-Z0-9]+$/.test(city)) {
        errorBox.innerText = "City name is unvalid";
        textTimeOut();
        return;
    }

    if (city.length === 2 || city.length === 1) {
        errorBox.innerText = "The city doesn't exist";
        textTimeOut();
        return;
    }


    searchForm.reset();

    fetchCoordinates(city);
})

async function fetchCoordinates(name) {
    try {

        let coordResponse = await
            fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(name)}&count=1&language=en&format=json`);

        if (!coordResponse.ok) {
            throw new Error(`Failed to get coordinates from server`);
        }

        let coordinatesData = await coordResponse.json();

        if (!coordinatesData) {
            throw new Error(`The coordinates doesn't exist`)
        }

        if (!coordinatesData.results || coordinatesData.results.length === 0) {
            throw new Error("No results for this city. Try another name.");
        }

        let lat = coordinatesData.results[0].latitude;
        let long = coordinatesData.results[0].longitude;
        let timeZone = coordinatesData.results[0].timezone;


        // countryZone = `${coordinatesData.results[0].name}, ${coordinatesData.results[0].country}`;
        countryZone = `${coordinatesData.results[0].name}, ${coordinatesData.results[0].country}`;
        countryHeaderTag.innerText = countryZone;


        localStorage.setItem("currentLatitude", lat);
        localStorage.setItem("currentLongitude", long);
        localStorage.setItem("currentTimeZone", timeZone);

        getWeatherData(lat, long, timeZone);

    } catch (error) {
        errorBox.innerText = error.message;
        textTimeOut()
    }

}

async function getWeatherData(val1, val2, val3) {
    try {
        let dataResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${val1}&longitude=${val2}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,precipitation_probability,uv_index,apparent_temperature&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&temperature_unit=celsius&wind_speed_unit=kmh&forecast_days=7&timezone=${val3}`);

        if (!dataResponse.ok) {
            throw new Error(`Failed to fetch weather data from server`);
        }

        let weatherData = await dataResponse.json();
        console.log(weatherData);


        // getting current info separately

        let currentData = weatherData.current;
        let windSpeed = currentData.wind_speed_10m;
        let currentTemperature = currentData.temperature_2m;
        let feelsLike = currentData.apparent_temperature;
        let humidity = currentData.relative_humidity_2m;
        let uvIndex = currentData.uv_index;
        let weatherCode = currentData.weather_code;

        const weatherConditions = {
            0: { text: "Clear Sky", icon: "☀️" }, 1: { text: "Mainly Clear", icon: "🌤️" },
            2: { text: "Partly Cloudy", icon: "⛅" }, 3: { text: "Overcast", icon: "☁️" },
            45: { text: "Fog", icon: "🌫️" }, 48: { text: "Depositing Rime Fog", icon: "🌫️" },
            51: { text: "Light Drizzle", icon: "🌧️" }, 53: { text: "Moderate Drizzle", icon: "🌧️" },
            55: { text: "Dense Drizzle", icon: "🌧️" }, 56: { text: "Light Freezing Drizzle", icon: "🌧️❄️" },
            57: { text: "Dense Freezing Drizzle", icon: "🌧️❄️" }, 61: { text: "Slight Rain", icon: "🌧️" },
            63: { text: "Moderate Rain", icon: "🌧️" }, 65: { text: "Heavy Rain", icon: "⛈️" },
            66: { text: "Light Freezing Rain", icon: "🌧️❄️" },
            67: { text: "Heavy Freezing Rain", icon: "🌧️❄️" }, 77: { text: "Snow Grains", icon: "🌨️" },
            71: { text: "Slight Snowfall", icon: "❄️" }, 73: { text: "Moderate Snowfall", icon: "❄️" },
            75: { text: "Heavy Snowfall", icon: "🌨️" }, 80: { text: "Slight Rain Showers", icon: "🌦️" },
            81: { text: "Moderate Rain Showers", icon: "🌦️" }, 82: { text: "Violent Rain Showers", icon: "🌧️" },
            85: { text: "Slight Snow Showers", icon: "🌨️" },
            86: { text: "Heavy Snow Showers", icon: "🌨️" },
            95: { text: "Thunderstorm", icon: "🌩️" }, 96: { text: "Thunderstorm with Slight Hail", icon: "⛈️" },
            99: { text: "Thunderstorm with Heavy Hail", icon: "⛈️" }
        };

        //daily


        let dailyData = weatherData.daily;
        let dailyWeatherCode = dailyData.weather_code;

        dailyWeatherCode.forEach((code, i) => {
            let iconB = weatherConditions[code] || { icon: "❓" };
            dailyWeatherCTags[i].innerText = iconB.icon;

        })

        let todaySunrise = new Date(dailyData.sunrise[0]).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        let todaySunset = new Date(dailyData.sunset[0]).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });

        let maxDailyTemps = weatherData.daily.temperature_2m_max;
        let minDailyTemps = weatherData.daily.temperature_2m_min;

        Array.from(highDailyTempTag).forEach((tag, i) => {
            tag.innerText = `${maxDailyTemps[i]}°C`;
        })

        Array.from(lowDailyTempTag).forEach((tag, i) => {
            tag.innerText = `${minDailyTemps[i]}°C`;
        })


        // apply info
        let weatherCodeSave = weatherConditions[weatherCode] || { text: "Unknown", icon: "❓" };
        weathercodeTag.innerText = weatherCodeSave.text;
        currentIconHeaderTag.innerText = weatherCodeSave.icon;
        tempTag.innerText = `${currentTemperature}°C`;
        feelslikeTag.innerText = feelsLike;
        humidityTag.innerText = `${humidity} %`;
        windSpeedTag.innerText = `${windSpeed} km/h`;
        currentTimezoneTag.innerText = (val3);
        uvIndexTag.innerText = uvIndex;
        currentSunriseTag.innerText = `${todaySunrise}`;
        currentSunsetTag.innerText = `${todaySunset}`;
        // countryHeaderTag.innerText = countryZone;




        let daysBox = Array.from(daysTag);

        function getDaysN() {
            let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            let now = new Date();
            let today = now.getDay();

            daysBox.forEach((el, i) => {
                if (i === 0) {
                    el.innerText = "Today";
                } else if (i === 1) {
                    el.innerText = "Tomorrow";
                } else {
                    let dayIndex = (today + i) % 7;
                    el.innerText = days[dayIndex];
                }
            });
        }

        getDaysN();

    } catch (e) {
        alert(e.message);
    }
}

refreshBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let restoreLocal = [localStorage.getItem("currentLatitude"), localStorage.getItem("currentLongitude")];
    if (restoreLocal[0] && restoreLocal[1]) {
        getWeatherData(restoreLocal[0], restoreLocal[1], localStorage.getItem("currentTimeZone"));
    } else {
        countryHeaderTag.innerText = `Paris, France`;
        getWeatherData(onloadLocationLat, onloadLocationLong, onloadLocationZone);
    }

    let successTag = document.getElementById("successTag");
    successTag.innerText = "Data was refreshed successfully";
    successTag.classList.add("show");

    setTimeout(() => {
        successTag.classList.remove("show");
    }, 3000);
});