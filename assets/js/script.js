const curWeathContEl = document.querySelector("#current-weather-container");

const city = "London"; 

// Function to get coorindates by making an API request to Geocoding based on a text location
const getLocationCoordinates = function(location) {
    // Currently limited to fetching one result
    const apiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=8f5c8e0438b4ba0bdedddf4274159607`;
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                getWeather(data[0].lat, data[0].lon); 
            });
        }
        else {
            alert("That is not a valid location!"); 
        }
    });
}

// Function to get weather information from One Call API
const getWeather = function(lat,lon) {
    // Grab current and daily weather
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=8f5c8e0438b4ba0bdedddf4274159607`;
    fetch(apiUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(data){
                console.log(data); 
                displayWeather(data.current,data.daily);
            })
        }
        else {
            alert("There was a problem retrieving the weather for that location!"); 
        }
    }); 
}

// Function to display weather

const displayWeather = function(current,daily) {
    // Display current weather information
    console.log("CURRENT WEATHER OBJ " + current); 

    const h2El = document.createElement("h2"); 
    const date = dayjs.unix(current.dt).format("M/DD/YYYY"); 
    h2El.textContent = `${city} (${date})`; 

    const iconEl = document.createElement("img");
    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`)
    iconEl.setAttribute("alt",`${current.weather[0].description}`); 

    h2El.appendChild(iconEl); 
    curWeathContEl.appendChild(h2El); 
    // Display daily weather information
    const ulEl = document.createElement("ul");
    ulEl.classList = "weather-list"
    ulEl.innerHTML = `
    <li>Temp: ${current.temp} °F</li>
    <li>Wind: ${current.wind_speed} MPH</li>
    <li>Humidity: ${current.humidity} %</li>`

    const uvLiEl = document.createElement("li");
    uvLiEl.textContent = "UV: "

    const uvCategoryEl = document.createElement("span");
    const uvi = current.uvi; 
    uvCategoryEl.classList = "p-1 rounded-pill text-light bg"; 

    if(uvi <= 2) {
        uvCategoryEl.classList.add("bg-success");
    }
    else if (uvi <= 5)
    {
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

getLocationCoordinates("London"); 