//  Select DOM items that are in the HTML 
const curWeathContEl = document.querySelector("#current-weather-container");
const dailyWeathContEl = document.querySelector("#daily-weather-container");
const citySearchFormEl = document.querySelector("#city-search-form");
const localButtonEl = document.querySelector("#local-btn");
const cityInputEl = document.querySelector("#city-input");
const searchesEl = document.querySelector("#searches");
// Initialization empty string for city so that it can be editted later for display purposes
let city = "";
// Initialization empty search array that will store old searches  
let searches = [];
// Initialize variable to prevent local location check from calling multiple times?
let positionAcquired = false;

// Function will call GeoCoding API to grab location given a city name from the text-input 
const getLocationCoordinates = function (city) {

    const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=8f5c8e0438b4ba0bdedddf4274159607`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // If the returned data is not an empty array
                if (data.length > 0) {
                    // Call function to store city input in searches list
                    addToSearches(city);
                    // Send the latitude and longitude to function to grab weather information 
                    getWeather(data[0].lat, data[0].lon);
                }
                else {
                    alert("That is not a valid location!");
                }
            });
        }
        else {
            alert("There was a problem searching for that location!");
        }
    })
        .catch(function (error) {
            alert("Unable to connect to OpenWeather");
        });
}

// Function to get weather information from One Call API, takes lat & lon from Geocoding API 
const getWeather = function (lat, lon) {
    // Fetch will only grab the current & daily data in imperial units 
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=minutely,hourly,alerts&appid=8f5c8e0438b4ba0bdedddf4274159607`;

    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // Call function to take current weather information and display on the current-weather panel
                displayCurrentWeather(data.current);
                // Call function to take daily weather information and display on the daily-weather panel 
                displayDailyWeather(data.daily);
            });
        }
        else {
            alert("There was a problem retrieving the weather for that location!");
        }
    })
}

// Function to display current weather
const displayCurrentWeather = function (current) {
    // Clear old display
    curWeathContEl.textContent = "";
    // Create header that will have the city name and the current date
    const h3El = document.createElement("h3");
    h3El.classList = "ms-3 mt-0 mb-0";
    // Convert date from ms over to desired date format
    const date = dayjs.unix(current.dt).format("M/DD/YYYY");
    h3El.textContent = `${city} (${date})`;

    // Grab and format icon based on the weather 
    const iconEl = document.createElement("img");
    iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png`)
    iconEl.setAttribute("alt", `${current.weather[0].description}`);
    iconEl.setAttribute("width", "60");
    iconEl.setAttribute("height", "60");

    // Add icon to header line
    h3El.appendChild(iconEl);
    // Add header to current-weather panel 
    curWeathContEl.appendChild(h3El);
    // Create weather property in a list 
    const ulEl = document.createElement("ul");
    ulEl.classList = "weather-list ms-3"
    ulEl.innerHTML = `
    <li>Temp: ${Math.ceil(current.temp)} °F</li>
    <li>Wind: ${current.wind_speed} MPH</li>
    <li>Humidity: ${current.humidity} %</li>`

    const uvLiEl = document.createElement("li");
    uvLiEl.textContent = "UV: "

    const uvCategoryEl = document.createElement("span");
    const uvi = current.uvi;
    uvCategoryEl.classList = "p-1 rounded-pill text-light bg";
    // Check UVI categories to give it a colored-background based on the three categories 
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
    // Add uvi value with colored background to the list item that displays uvi
    uvLiEl.appendChild(uvCategoryEl);
    // Append uvi list item to rest of list
    ulEl.appendChild(uvLiEl);
    // Add property list to the current-weather panel 
    curWeathContEl.appendChild(ulEl);

}

// Function will display daily weather for the next 5 days of the week 
const displayDailyWeather = function (daily) {
    // Clear old content
    dailyWeathContEl.textContent = "";
    // Grabs daily[1] -> daily[6], which are the next 5-days as daily[0] is the current day 
    for (let i = 1; i < 6; i++) {
        // Create div that will be the holder card for the daily[i] weather
        const dailyCardEl = document.createElement("div");
        dailyCardEl.classList = "col-2 card text-light panel-bl";
        // Convert time from ms to current date in desired format
        const date = dayjs.unix(daily[i].dt).format("M/DD/YYYY");
        // Create header element that will hold the date, also is the card title  
        const cardTitleEl = document.createElement("h5");
        cardTitleEl.textContent = date;
        cardTitleEl.classList = "mt-2";
        // Add date to the card
        dailyCardEl.appendChild(cardTitleEl);
        // Create the weather icon based on current weather
        const iconEl = document.createElement("img");
        iconEl.setAttribute("src", `http://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png`);
        iconEl.setAttribute("alt", `${daily[i].weather[0].description}`);
        iconEl.setAttribute("width", "60");
        iconEl.setAttribute("height", "60");
        // Add icon to the card below the card title/date
        dailyCardEl.appendChild(iconEl);
        // Create weather properties list
        const ulEl = document.createElement("ul");
        ulEl.classList = "weather-list small-font";
        ulEl.innerHTML = `
        <li>Temp: ${Math.ceil(daily[i].temp.day)} °F</li>
        <li>Wind: ${daily[i].wind_speed} MPH</li>
        <li>Humidity: ${daily[i].humidity} %</li>`
        // Add weather list to bottom of card
        dailyCardEl.appendChild(ulEl);
        // Add card to the panel for the 5-day weather panel 
        dailyWeathContEl.appendChild(dailyCardEl);
    }
}

// Function to save searches list
const saveSearches = function () {
    // Saves searches in the localStorage 
    localStorage.setItem("searches", JSON.stringify(searches));
}
// Function to load searches list if any changes or page loads
const loadSearches = function () {
    // Grabs searches from the localStorage
    searches = JSON.parse(localStorage.getItem("searches", searches));
    // Check to see if searches is empty, as in the user has not used this before, or they deleted the searches previously
    if (!searches) {
        // Adds Austin as the search so that the weather app displays something
        searches = ["Austin"];
    }
    // Remove old content
    searchesEl.textContent = "";
    // Iterates through the searches array and creates a list of buttons to display below the search form
    searches.forEach(search => {
        const liEl = document.createElement("li");
        const buttonEl = document.createElement("button");
        buttonEl.classList = "panel-bl";
        buttonEl.textContent = search;
        // Append button to list
        liEl.appendChild(buttonEl);
        // Append list to bottom of search form 
        searchesEl.appendChild(liEl);
    });


}


// Add the newly searched city to the old searches list 
const addToSearches = function (city) {
    // Check if the prevSearches already includes the current search location
    if (searches.includes(city)) {
        const oldIndex = searches.indexOf(city);
        searches.splice(oldIndex, 1);
    }
    // Add latest search to the top of the array 
    searches.unshift(city);

    // Set maximum number of old searches to keep
    const maxSearches = 8;
    // Check to see if the number of searches is greater than the maximum number of searches
    if (searches.length > 8) {
        // Removes last element in searches array 
        searches.pop();
    }
    // Save new searches 
    saveSearches();
    // Load the searches to generate new list of buttons after new city has been added 
    loadSearches();
}


// Function to get user's location using the navigator's geolocation API 
const getUserLocation = function (position) {
    // Grab user's coordinates from the position object returned by the navigator's geolocation API 
    userLocation = position.coords;
    // URL for reverse-geocoding search from Open Weather
    const apiUrl = ` https://api.openweathermap.org/geo/1.0/reverse?lat=${userLocation.latitude}&lon=${userLocation.longitude}&limit=1&appid=8f5c8e0438b4ba0bdedddf4274159607`;
    // Fetch to get the city that the user is in from their longitude and latitude 
    fetch(apiUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                // If the user's city is the same as the last searched city in the searches history, exit the function 
                if (searches[0] === data[0].name) {
                    return;
                }
                // Else add the city to the top of the list, and find the weather information based on the coordinates from the navigator's geolocation API 
                city = data[0].name;
                localCity = city; 
                addToSearches(city);
                getWeather(userLocation.latitude, userLocation.longitude);
                locationAcquired = true;
            })
        }
        else {
            alert("There was a problem getting your location!");
        }
    });
}

// Function if user denies permissions to geolocation API 
const locationDenied = function() {
    alert("You have denied access to your location. To see the local weather, please click the button again and allow access to your location."); 
}

// Function to grab city name and look up weather on submit event
const searchSubmitHandler = function (event) {
    // Disables the refresh upon event submission
    event.preventDefault();
    // Grab text value that is in the enter
    city = cityInputEl.value.trim();
    // Reset the form to clear out the input form 
    citySearchFormEl.reset();
    // Call the function that will get the weather information 
    getLocationCoordinates(city);
}
// Function to grab city name and look up weather based on click event for one of the old search buttons
const cityClickHandler = function (event) {
    if (event.target.matches("button")) {
        // Set the city to search as the text content of the button 
        city = event.target.textContent;
        getLocationCoordinates(city);
    }
}

// If user clicks on local weather button, will call the navigator geolocation API.
// API will prompt the user whether or not they would like to provide their location
// If allowed, function to call user's location will start
// If denied, function to inform the user that the location has been denied will start 
const localClickHandler = function (event) {
    // getCurrentPosition is used to prevent refreshes
    navigator.geolocation.getCurrentPosition(getUserLocation, locationDenied); 
}

// Event listeners for searching for a city input via text input or button click 
citySearchFormEl.addEventListener("submit", searchSubmitHandler);
searchesEl.addEventListener("click", cityClickHandler);
localButtonEl.addEventListener("click", localClickHandler);



// Create function to display some weather properties on page start
window.onload = function () {
    // Grab searches from the local storage 
    loadSearches();
    // If searches is not empty, load up the weather for the latest searched location or austin which will be the default value for index 0
    if (searches.length > 0) {
        // Force the website to call the function to display the first item in the searches list in local storage. This is either Austin or the last searched city. 
        city = searches[0];
        getLocationCoordinates(searches[0])
    }
}

