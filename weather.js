(function () {
    "use strict";
    
    // Generate creds
    const partA = "N2I0NDk0M2Y3MDc2ZTEwODAyYjljYmNjYjE2N2YxNTE="; 
    const partB = atob(partA)

    let state = {
        city: "Tulsa",
        country: "US",
        units: "imperial"
    }

    // Try Local Storage
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

    // Set Modal
    let modalElement = document.querySelector(".modal");
    let closeModalButton;
    
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

    // WIP: NWS Weather Provider
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

    // Weather App
    const app = {
        event: {
            musicPlayPause: () => {
                const musicButton = document.querySelector(".js-music") 
                const musicPlayer = document.querySelector(".music") 

                
                if (musicButton.classList.contains("disabled")) {
                    musicPlayer.play();
                } else {
                    musicPlayer.pause();
                }
                musicButton.classList.toggle("disabled")
            },
            updateCity: async () => {
                const zipCodeInput = document.getElementById("zipInput");
                const zipCode = zipCodeInput.value || "74172";
                const api = `https://api.openweathermap.org/geo/1.0/zip?zip=${zipCode}&appid=${partB}`;
                // TODO: Set up NWS 
                // https://www.weather.gov/documentation/services-web-api
                fetch(api)
                .then(response => response.json())
                .then(async (data) => {
                    console.log("updateCity", data)
                    
                    if (data.name) {
                        state.city = data.name
                        localStorage.setItem("city", state.city)

                        try {
                            const data = await app.getData();
                            app.refresh(data);
                            
                        } catch (error) {
                            console.error('Error fetching weather data:', error);
                            // cityElement.textContent = "Error";
                            conditionElement.textContent = "Unable to fetch weather details.";
                        }
                        
                        // closeModalButton.click();
                        modalElement = document.querySelector(".modal");
                        modalElement.classList.remove("is-visible");
                    }
                });
            },
        },
        getData: async () => {
            // TODO: Update City Event to Set State 
            let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${state.city},${state.country}&appid=${partB}&units=${state.units}`;
            const data = fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                return data;
            });
            return await data;
        },
        init: async () => {
            console.log("init")
            // Set services
            // const tempUnits = (state.units === "imperial" ) ? "ºF" : "ºC";

            // Set music 
            const musicButton = document.querySelector(".js-music") 
            musicButton.addEventListener("click", app.event.musicPlayPause, false);

            // Get Data
            try {
                const data = await app.getData();
                console.log("try/data", data)

                await app.refresh(data);
                
            } catch (error) {
                console.error('Error fetching weather data:', error);
                // cityElement.textContent = "Error";
                conditionElement.textContent = "Unable to fetch weather details.";
            }
        },
        refresh: async (data) => {            
            console.log("refresh", data)
            
            // Refresh data
            const tempUnits = (state.units === "imperial" ) ? "ºF" : "ºC";
            const { coord, name, main, weather, wind, visibility, sys } = data;

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
            
            cityElement.textContent = name;
            conditionElement.textContent = weather[0].description;
            temperatureElement.textContent = `${Math.round(main.temp)}${tempUnits}`;
            temperatureFeelsElement.textContent = `${Math.round(main.feels_like)}${tempUnits}`;
            temperatureElementHigh.textContent = `${Math.round(main.temp_max)}${tempUnits}`;
            temperatureElementLow.textContent = `${Math.round(main.temp_min)}${tempUnits}`;
            humidityElement.textContent = `${main.humidity}%`;
            pressureElement.textContent = app.utils.mbToInHg(main.pressure);
            windElement.textContent = `${app.utils.getWindDirection(wind.deg)} ${wind.speed} mph `;
            visibilityElement.textContent = `${visibility / 1000} mi`;
            dateElement.textContent = app.utils.getFormattedDate();
            sunriseElement.textContent = app.utils.formatDateTime(sys.sunrise * 1000);
            sunsetElement.textContent = app.utils.formatDateTime(sys.sunset * 1000);

            nws(coord);
            
        },
        utils: {
            
            celsiusToFahrenheit: (celsius) => {
                let degress = (celsius * 9/5) + 32;
                return degress.toFixed();
            },
            getFormattedDate: () => {
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
            },
            getWindDirection: (degree) => {
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
            },
            formatDateTime: (utcTimeNumber) => {
                return new Date(utcTimeNumber).toLocaleTimeString("en-US",  {timeStyle: 'short'});
            },
            kmToMiles: (km) => {
               return Math.round(km * 0.621371 * 10) / 10;
            },
            mbToInHg: (mb) => {
               return (mb / 33.8639).toFixed(2);
            }
        }
    }
    
    // DOMContentLoaded Event
    document.addEventListener("DOMContentLoaded", (event) => {
        app.init();
        
        // Set Time
        const timeElement = document.querySelector('.js-time');
        setInterval(() => timeElement.innerText = new Date().toLocaleTimeString('en-US'), 1000);

        const buttonCityEdit = document.querySelector('.js-city');
        buttonCityEdit.addEventListener("click", modal.open, false);

        closeModalButton = document.getElementById("closeModal");
        closeModalButton.addEventListener("click", modal.close, false);

        const zidSubmitInput = document.getElementById("zipSubmit");
        zidSubmitInput.addEventListener("click", async (event) => {
            event.preventDefault();
            await app.event.updateCity();
        }, false);

        const zidSubmitForm = document.getElementById("updateCityForm");
        zidSubmitForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            await app.event.updateCity();
        });

        modalElement = document.querySelector(".modal");
    });
})();
