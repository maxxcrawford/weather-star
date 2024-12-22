(function () {
    "use strict";

    console.log(document)
    
    const partA = "N2I0NDk0M2Y3MDc2ZTEwODAyYjljYmNjYjE2N2YxNTE="; 
    const partB = atob(partA)

    let state = {
        city: "tulsa"
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

    console.log("init", state)
        
     // Replace with your API key
    // const cityInput = cityName || "Tulsa";
    
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state.city}&appid=${partB}&units=metric`;

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
            

            const { coord, name, main, weather, wind, visibility } = data;

            console.log(main.temp_max)

            // Update DOM with weather data
            cityElement.textContent = name;
            conditionElement.textContent = weather[0].description;
            temperatureElement.textContent = celsiusToFahrenheit(main.temp);
            temperatureFeelsElement.textContent = celsiusToFahrenheit(main.feels_like);
            temperatureElementHigh.textContent = celsiusToFahrenheit(main.temp_max);
            temperatureElementLow.textContent = celsiusToFahrenheit(main.temp_min);
            humidityElement.textContent = `${main.humidity}%`;
            pressureElement.textContent = mbToInHg(main.pressure);
            windElement.textContent = `${kmToMiles(wind.speed)} mph`;
            visibilityElement.textContent = `${kmToMiles((visibility) / 1000)} mi`;
            dateElement.textContent = getFormattedDate();

            nws(coord);
            
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            // cityElement.textContent = "Error";
            conditionElement.textContent = "Unable to fetch weather details.";
        });
    }

    function updateCity(event) {
        event.preventDefault();
        
        console.log("updateCity")

        
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
                closeModalButton.click();
            }

            // cityName = data.name
            
        });

    }


    document.addEventListener("DOMContentLoaded", (event) => {
        console.log("DOM fully loaded and parsed");
        // St. Paul
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

        modalElement = document.querySelector(".modal");
        
    });


})();
