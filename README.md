# Weather-Dashboard-Week-6-Challenge

## Purpose

![Searching various cities and switching them using buttons to display weather on the dashboard](https://github.com/AshisPatel/Weather-Dashboard-Week-6-Challenge/blob/main/assets/images/weather-dashboard-preview.gif)

The Weather Dashboard is a simple interface that displays the current weather and 5-day future forecast for a city. The city can be searched via text-input or selected from a list of past searches on the local machine. For more details on the functionality, please check out the *Function* section. 

## Function

By default, if there are no previous searches, as in the user has cleared the localStorage for the site or the site has never been accessed before, the dashboard will display the weather for the city of Austin. 

The Weather Dashboard will search for a city either when the user submits text in the search form, or clicks on a button that contains the city name in the old search list. The text is taken from the clicked button and "passed" through the submit form. 

The submitted city name is passed into a fetch request to OpenWeather's **Geocoding API**, which takes the city name and returns its latitude and longitude. The latitude and longitude are then passed to OpenWeather's **One Call API**, which returns weather for various time ranges. In the script, all of the other weather types except *current* and *daily* are excluded. 

The current weather and daily weather displays are then dynamically generated and placed onto a static-html grid created using Bootstrap. 

### Previous Searches Functionality

The old search history has been manually limited to only hold 8 previous searches. This is simply a design choice to keep the interface looking neat and prevent the search history from growing too long. 

When a city is submitted to the functions to get the weather data, another function will check to see if the city has previously been searched. If the city *has not* been searched before, it will be added to the top of the list. If the new addition causes the city to grow past 8 items, the last item in the search list will be removed (this should be the oldest search). If the city *has* been searched before, then it will be moved up to the top of the search list upon a new search of the same city. 

### Local Weather Button Functionality

The local weather button uses the navigator geolocation API call to retrieve the user's coordinates, if they allow the location access to their position. By clicking on the "Local Weather" button, the browser will prompt the user if they would like to provide their location. If they choose not to, then an alert will pop-up informing the user that their location could not be retrieved without their consent. If approved, the name of their city will be obtained using OpenWeather's GeoCoding API by performing a reverse-geolocate. Then, the weather information will be displayed. 

## Built With

* HTML
* CSS
* Jscript

## Website

https://ashispatel.github.io/Weather-Dashboard-Week-6-Challenge/

## Current Issues 
* Prompt for user location says "This file wants to" as opposed to "This file wants to: Access your location". UNLESS the user tabs out and tabs back in, then the prompt will display the proper message. 
* Once the location is denied, the button cannot be re-used to search for the local location. Currently checking if there is a way to let the button re-ask for the persmission setting. 

## End Note - A Thank You to the Reader 

Thank you for taking the time to check out my Weather Dashboard and README! In this week's challenge, I learned to leverage the power of fetch requests and external APIs! Its like driving a car, rather than trying to build a car. It sure beat me having to go out and test the humidity myself. Please enjoy the fun fact below and a random gif from my collection of things that make me laugh! Hopefully it makes you laugh too and gives you something fun to share with a friend! :) 

**Fun Fact**: A 40 % chance of rain does not mean that there is a 40 % chance that rain will occur in a location, but rather 40 % of the location's area is receiving rain. I thought I was being scammed by the news, turns out I just have *really bad luck*. 

![Animated man slaps dog and gets slapped back](https://github.com/AshisPatel/Weather-Dashboard-Week-6-Challenge/blob/main/assets/images/dog-slap.gif)

*Animal abuse is not ok*






