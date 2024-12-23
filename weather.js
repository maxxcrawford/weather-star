(function () {
    "use strict";
    
    const partA = "N2I0NDk0M2Y3MDc2ZTEwODAyYjljYmNjYjE2N2YxNTE="; 
    const partB = atob(partA)

    let state = {
        city: "Tulsa",
        units: "imperial"
    }

    if (!localStorage.getItem("city")) {
        state = {
            city: "Tulsa"
        };
        localStorage.setItem("city", state.city)
    } else {
        // state.city = 
        const localStorageCity = localStorage.getItem("city");
        state.city = localStorageCity;
        console.log("localStorage detected", localStorage.getItem("city"))
    }    

    let modalElement = document.querySelector(".modal");
    let closeModalButton;
    // let bodyElement = document.querySelector("body");
    
    const modal = {
        close: ()=> {
            console.log("modal.close")
            modalElement.classList.remove("is-visible");
        },
        open: ()=> {
            console.log("modal.open", modalElement)
            modalElement.classList.add("is-visible");
        }
    }

    function getWindDirection(degree) {
        console.log(degree)
        if ((degree >= 350 && degree <= 360) || (degree >= 0 && degree <= 10)) return "N";
        if (degree >= 20 && degree <= 30) return "N/NE";
        if (degree >= 40 && degree <= 50) return "NE";
        if (degree >= 60 && degree <= 70) return "E/NE";
        if (degree >= 80 && degree <= 100) return "E";
        if (degree >= 110 && degree <= 120) return "E/SE";
        if (degree >= 130 && degree <= 140) return "SE";
        if (degree >= 150 && degree <= 160) return "S/SE";
        if (degree >= 170 && degree <= 190) return "S";
        if (degree >= 200 && degree <= 210) return "S/SW";
        if (degree >= 220 && degree <= 230) return "SW";
        if (degree >= 240 && degree <= 250) return "W/SW";
        if (degree >= 260 && degree <= 280) return "W";
        if (degree >= 290 && degree <= 300) return "W/NW";
        if (degree >= 310 && degree <= 320) return "NW";
        if (degree >= 330 && degree <= 340) return "N/NW";
        return ""; // For values outside the valid range
    }

    function nws(coord) {
        const nwsUrl = `https://api.weather.gov/points/${coord.lat},${coord.lon}`;
        // TODO: Set up NWS 
        // https://www.weather.gov/documentation/services-web-api
        fetch(nwsUrl)
        .then(response => response.json())
        .then(data => {
            console.log(data)
        });
    }
    
    // Select DOM elements for updating weather details
    function init() {

    const tempUnits = (state.units === "imperial" ) ? "ºF" : "ºC";

    console.log(state.units)
    console.log(tempUnits)
        
     // Replace with your API key
    // const cityInput = cityName || "Tulsa";
    
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state.city}&appid=${partB}&units=${state.units}`;

    console.log(apiUrl)

    const musicButton = document.querySelector(".js-music") 
    const musicPlayer = document.querySelector(".music") 

    musicButton.addEventListener("click", () => {
        if (musicButton.classList.contains("disabled")) {
            musicPlayer.play();
        } else {
            musicPlayer.pause();
        }
        musicButton.classList.toggle("disabled");
    });
    
    const cityElement = document.querySelector('.js-city');
    const conditionElement = document.querySelector('.js-condition');
    const temperatureElement = document.querySelector('.js-temperature');
    const temperatureFeelsElement = document.querySelector('.js-temperature-feels');
    const temperatureElementHigh = document.querySelector('.js-temperature-high');
    const temperatureElementLow = document.querySelector('.js-temperature-low');
    const humidityElement = document.querySelector('.js-humidity');
    const pressureElement = document.querySelector('.js-barometric-pressure');
    const windElement = document.querySelector('.js-wind');
    const visibilityElement = document.querySelector('.js-visibility');
    const dateElement = document.querySelector('.js-date');
    const sunriseElement = document.querySelector('.js-sunrise');
    const sunsetElement = document.querySelector('.js-sunset');

    // js-temperature
    // js-temperature-feels
    // js-temperature-high
    // js-temperature-low
    
    function celsiusToFahrenheit(celsius) {
        let degress = (celsius * 9/5) + 32;
        return degress.toFixed();
    }

    const getFormattedDate = () => {
        const date = new Date();
        const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

        const dayOfWeek = days[date.getDay()];
        const month = months[date.getMonth()];
        const day = date.getDate();
        
        const daySuffix = (d) => {
            if (d > 3 && d < 21) return 'TH'; // Handles 4th-20th
            switch (d % 10) {
                case 1: return 'ST';
                case 2: return 'ND';
                case 3: return 'RD';
                default: return 'TH';
            }
        };

        return `${dayOfWeek} ${month} ${day}${daySuffix(day)}`;
    };

    const kmToMiles = km => Math.round(km * 0.621371 * 10) / 10;
    const mbToInHg = mb => (mb / 33.8639).toFixed(2);

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            console.log(data)
            
            const { coord, name, main, weather, wind, visibility, sys } = data;

            console.log(main.temp_max)

            // Update DOM with weather data
            cityElement.textContent = name;
            conditionElement.textContent = weather[0].description;
            temperatureElement.textContent = `${Math.round(main.temp)}${tempUnits}`;
            temperatureFeelsElement.textContent = `${Math.round(main.feels_like)}${tempUnits}`;
            temperatureElementHigh.textContent = `${Math.round(main.temp_max)}${tempUnits}`;
            temperatureElementLow.textContent = `${Math.round(main.temp_min)}${tempUnits}`;
            humidityElement.textContent = `${main.humidity}%`;
            pressureElement.textContent = mbToInHg(main.pressure);
            windElement.textContent = `${getWindDirection(wind.deg)} ${wind.speed} mph `;
            visibilityElement.textContent = `${visibility / 1000} mi`;
            dateElement.textContent = getFormattedDate();
            sunriseElement.textContent = new Date(sys.sunrise * 1000).toLocaleTimeString("en-US",  {timeStyle: 'short'});
            sunsetElement.textContent = new Date(sys.sunset * 1000).toLocaleTimeString("en-US",  {timeStyle: 'short'});

            nws(coord);
            
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // cityElement.textContent = "Error";
            conditionElement.textContent = "Unable to fetch weather details.";
        });
    }

    function updateCity(event) {
        console.log("updateCity")
        event.preventDefault();
        
        const zipCodeInput = document.getElementById("zipInput");
        const zipCode = zipCodeInput.value || "74172";

        // const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput}&appid=${partB}&units=metric`;

        // http://api.openweathermap.org/geo/1.0/zip?zip={zip code},{country code}&appid={API key}
        const api = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${partB}`;
        // TODO: Set up NWS 
        // https://www.weather.gov/documentation/services-web-api
        fetch(api)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            
            if (data.name) {
                state.city = data.name
                localStorage.setItem("city", state.city)
                init();
                // closeModalButton.click();
                modalElement = document.querySelector(".modal");
                modalElement.classList.remove("is-visible");
            }
        });
    }

    document.addEventListener("DOMContentLoaded", (event) => {
        console.log("DOM fully loaded and parsed");

        init();

        // Set Time
        const timeElement = document.querySelector('.js-time');
        setInterval(() => timeElement.innerText = new Date().toLocaleTimeString('en-US'), 1000);

        const buttonCityEdit = document.querySelector('.js-city');
        buttonCityEdit.addEventListener("click", modal.open, false);

        closeModalButton = document.getElementById("closeModal");
        closeModalButton.addEventListener("click", modal.close, false);

        const zidSubmitInput = document.getElementById("zipSubmit");
        zidSubmitInput.addEventListener("click", updateCity, false);

        const zidSubmitForm = document.getElementById("updateCityForm");
        zidSubmitForm.addEventListener("submit", updateCity);

        modalElement = document.querySelector(".modal");
        
    });


})();
