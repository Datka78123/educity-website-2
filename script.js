//variables ==========================================================
const shearchInitate = document.getElementById("search");
const locationInput = document.getElementById("input");

const mainPart = document.querySelector(".main");
const results = document.querySelector(".results");
const closebtn = document.querySelector(".close-menu-btn");
const title = document.querySelector(".title");
const container = document.querySelector(".result-wrapper");

const comunicate = document.querySelector(".place-holder-text");
let isFetched = false

let latvar = ''
let lonvar = ''
let urlvar = ''



//functions ==========================================================

const addResult = (title, value) => {
    const div = document.createElement("div");
    div.classList.add("result-content-wrapper");

    div.innerHTML = `
        <p class="result-title">${title}</p>
        <p class="result-content">${value}</p>
    `;

    container.appendChild(div);
}

const fetchCityData = (city) =>{
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`)

    .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
    })
    .then(data => {
            latvar = data.results[0].latitude;
            lonvar = data.results[0].longitude;
            urlvar = `https://api.open-meteo.com/v1/forecast?latitude=${latvar}&longitude=${lonvar}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,pressure_msl,cloud_cover,is_day`;            comunicate.textContent = `results for:${city}`;
            comunicate.classList.remove("error");

            fetchWeatherData(urlvar);
    })

    .catch(error => {
        comunicate.textContent = "Error. Please try city Name.";
        comunicate.classList.add("error");
    })
}

const fetchWeatherData = (url) => {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data.current);

        addResult("Temperature", data.current.temperature_2m + "°C");
        addResult("Feels Like", data.current.apparent_temperature + "°C");
        addResult("Humidity", data.current.relative_humidity_2m + "%");
        addResult("Weather Code", data.current.weather_code);
        addResult("Wind Speed", data.current.wind_speed_10m + " km/h");
        addResult("Wind Direction", data.current.wind_direction_10m + "°");
        addResult("Pressure", data.current.pressure_msl + " hPa");
        addResult("Cloud Cover", data.current.cloud_cover + "%");
        addResult("Day / Night", data.current.is_day ? "Day" : "Night");
        mainPart.classList.add("active");
        results.classList.add("active");
        isFetched = true;

        })
        .catch(error => {
            console.error("Error fetching weather data:", error);
        });
};

//logic ==========================================================
    shearchInitate.addEventListener("click", () => {
        let cityName = locationInput.value.trim();
        cityName = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        if (cityName === "") {
            comunicate.textContent = "Please enter a city name!";
            comunicate.classList.add("error");
        } else {
            fetchCityData(cityName);
        }
    });

    title.textContent = `Weather in ${cityName}`;
    closebtn.addEventListener("click", ()=>{
        results.classList.remove("active");
        mainPart.classList.remove("active");
    })

locationInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        shearchInitate.click();
    }
});

