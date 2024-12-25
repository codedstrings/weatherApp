let formSubmit = document.querySelector('#location-form');
// console.log(formSubmit);
let apiKey = 'YRDK5JJJYJTZN4JWUQX9JSHFD'

const handleSubmit = async (event) => {
    event.preventDefault(); // Prevents the form from reloading the page
    let location = event.target.location.value.trim();
    if (!location) {
        alert("Please enter a valid location.");
        return;
    }
    try {
        console.log(`Fetching weather data for: ${location}`);
        let apiResponse = await getWeatherData(location);
        console.log("Weather data received:", apiResponse);

        //process the weather data
        processData(apiResponse);
    } catch (error) {
        console.error("Failed to fetch weather data:", error.message);
    }
}

async function getWeatherData(location) {
    let URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}&contentType=json`

    try {
        const response = await fetch(URL, { mode: 'cors' });
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error("Error fetching data from API:", error.message);
        throw error;
    }
}

function processData(apiResponse) {
    let location = apiResponse.resolvedAddress;
    let currentConditions = apiResponse.currentConditions;
    let days = apiResponse.days;
    let weatherData = {
        location: location,
        currentConditions: currentConditions,
        days: days
    }
    console.log("Processed weather data:", weatherData);
    displayWeatherData(weatherData); 
}

function displayWeatherData(weatherData){    
    let location = weatherData.location;
    let currentConditions = weatherData.currentConditions;
    let days = weatherData.days;

    let locationDiv = document.querySelector('#location');
    locationDiv.innerHTML = `Location: ${location}`;

    let currentConditionsDiv = document.querySelector('#current-conditions');
    currentConditionsDiv.innerHTML = `Current Conditions: ${currentConditions.conditions}, ${currentConditions.temp}°F`;
    
    //unhide the weatherData div
    let weatherDiv = document.querySelector('#weather');
    weatherDiv.classList.remove('hidden');
}

//add event listener to the form
formSubmit.addEventListener('submit', handleSubmit);

