const curWeathContEl = document.querySelector("#current-weather-container");
const dailyWeathContEl = document.querySelector("#daily-weather-container");
const citySearchFormEl = document.querySelector("#city-search-form");
const cityInputEl = document.querySelector("#city-input");
const searchesEl = document.querySelector("#searches");

let city = "";

let searches = [];

// Function to add searched terms to the search history 

// Function to get coorindates by making an API request to Geocoding based on a text location
// This function needs more handling if a valid city name is not typed in....
const getLocationCoordinates = function (city) {
    // Currently limited to fetching one result
    let apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=8f5c8e0438b4ba0bdedddf4274159607`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // If the returned data is not an empty array... 
                if (data.length > 0 ) {
                    addToSearches(city);
                    getWeather(data[0].lat, data[0].lon);
                }
                else {
                    alert("That is not a valid location!"); 
                }
            });
        }
    })
    .catch(function(error){
        alert("Unable to connect to OpenWeather"); 
    });
}

// Function to get weather information from One Call API
const getWeather = function (lat, lon) {
    // Grab current and daily weather
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=8f5c8e0438b4ba0bdedddf4274159607`;
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data); 
                displayCurrentWeather(data.current);
                displayDailyWeather(data.daily);
            });
        }
        else {
            alert("There was a problem retrieving the weather for that location!");
        }
    })
}

// Function to display weather
const displayCurrentWeather = function (current) {
    // Clear old display
    curWeathContEl.textContent = "";
    // Display current weather information
    const h2El = document.createElement("h2");
    const date = dayjs.unix(current.dt).format("M/DD/YYYY");
    h2El.textContent = `${city} (${date})`;

    const iconEl = document.createElement("img");
    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`)
    iconEl.setAttribute("alt", `${current.weather[0].description}`);

    h2El.appendChild(iconEl);
    curWeathContEl.appendChild(h2El);
    // Display daily weather information
    const ulEl = document.createElement("ul");
    ulEl.classList = "weather-list"
    ulEl.innerHTML = `
    <li>Temp: ${Math.ceil(current.temp)} °F</li>
    <li>Wind: ${current.wind_speed} MPH</li>
    <li>Humidity: ${current.humidity} %</li>`

    const uvLiEl = document.createElement("li");
    uvLiEl.textContent = "UV: "

    const uvCategoryEl = document.createElement("span");
    const uvi = current.uvi;
    uvCategoryEl.classList = "p-1 rounded-pill text-light bg";

    if (uvi <= 2) {
        uvCategoryEl.classList.add("bg-success");
    }
    else if (uvi <= 5) {
        uvCategoryEl.classList.add("bg-warning");
    }
    else {
        uvCategoryEl.classList.add("bg-danger");
    }

    uvCategoryEl.textContent = `${uvi}`;

    uvLiEl.appendChild(uvCategoryEl);
    ulEl.appendChild(uvLiEl);

    curWeathContEl.appendChild(ulEl);

}
// Function will display daily weather for the next 5 days of the week 
const displayDailyWeather = function (daily) {
    // Clear old content
    dailyWeathContEl.textContent = "";
    for (let i = 1; i < 6; i++) {
        const dailyCardEl = document.createElement("div");
        dailyCardEl.classList = "col-2 card bg bg-dark text-light";

        const date = dayjs.unix(daily[i].dt).format("M/DD/YYYY");
        const cardTitleEl = document.createElement("h3");
        cardTitleEl.textContent = date;

        dailyCardEl.appendChild(cardTitleEl);

        const weatherIcon = document.createElement("img");
        weatherIcon.setAttribute("src", `http://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png`);
        weatherIcon.setAttribute("alt", `${daily[i].weather[0].description}`);

        dailyCardEl.appendChild(weatherIcon);

        const ulEl = document.createElement("ul");
        ulEl.classList = "weather-list";
        // Currently calculating the average temp???
        const avgDailyTemp = Math.ceil((daily[i].temp.min + daily[i].temp.max) / 2);
        ulEl.innerHTML = `
        <li>Temp: ${avgDailyTemp} °F</li>
        <li>Wind: ${daily[i].wind_speed} MPH</li>
        <li>Humidity: ${daily[i].humidity} %</li>`

        dailyCardEl.appendChild(ulEl);

        dailyWeathContEl.appendChild(dailyCardEl);
    }
}

const saveSearches = function () {
    localStorage.setItem("searches", JSON.stringify(searches));
}

const loadSearches = function () {
    searches = JSON.parse(localStorage.getItem("searches", searches));
    if (!searches) {
        searches = []; 
    }
    // Remove old content
    searchesEl.textContent = "";
   
    searches.forEach(search => {
        const liEl = document.createElement("li");
        const buttonEl = document.createElement("button");
        buttonEl.classList = "";
        buttonEl.textContent = search;
        liEl.appendChild(buttonEl);
        searchesEl.appendChild(liEl);
    });


}

const addToSearches = function (city) {
    // Check if the prevSearches already includes the current search location
    if (searches.includes(city)) {
        const oldIndex = searches.indexOf(city); 
        searches.splice(oldIndex,1); 
    }
    // Add latest search to the top of the array 
    searches.unshift(city);
    saveSearches();
    loadSearches();
}

const loadPage = function () {
    loadSearches(); 
    // If searches is not empty, load up the weather for the lawst searched location 
    if (searches.length > 0) {
        city = searches[0]; 
        getLocationCoordinates(searches[0])
    }
}


const searchSubmitHandler = function (event) {
    // Disables the refresh upon event submission
    event.preventDefault();
    city = cityInputEl.value.trim();
    // Reset the form to clear out the input form 
    citySearchFormEl.reset(); 
    getLocationCoordinates(city);
    //addToSearches(city);
}

const cityClickHandler = function (event) {
    if (event.target.matches("button")) {
        city = event.target.textContent; 
        getLocationCoordinates(city); 
        //addToSearches(city); 
    }
}



citySearchFormEl.addEventListener("submit", searchSubmitHandler);
searchesEl.addEventListener("click", cityClickHandler); 

// Load searches list on load and populate weather for item at the top of the list. 
loadPage();
//city = searches[0];
//getLocationCoordinates(searches[0]);