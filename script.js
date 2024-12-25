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
formSubmit.addEventListener('submit', handleSubmit);

