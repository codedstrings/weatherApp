let formSubmit = document.querySelector('#location-form');
const apiKey = 'YRDK5JJJYJTZN4JWUQX9JSHFD';

// Initialize Lucide icons
lucide.createIcons();

const handleSubmit = async (event) => {
    event.preventDefault();
    let location = event.target.location.value.trim();
    if (!location) {
        alert("Please enter a valid location.");
        return;
    }

    // Show loading state
    document.querySelector('#loading').classList.remove('hidden');
    document.querySelector('#weather').classList.add('hidden');

    try {
        console.log(`Fetching weather data for: ${location}`);
        let apiResponse = await getWeatherData(location);
        console.log("Weather data received:", apiResponse);

        //process the weather data
        processData(apiResponse);
    } catch (error) {
        console.error("Failed to fetch weather data:", error.message);
    } finally {
        // Hide loading state
        document.querySelector('#loading').classList.add('hidden');
    }
}

async function getWeatherData(location) {
    let URL = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=us&key=${apiKey}&contentType=json`;

    try {
        const response = await fetch(URL, { mode: 'cors' });
        return await response.json();
    } catch (error) {
        console.error("Error fetching data from API:", error.message);
        throw error;
    }
}

function processData(apiResponse) {
    let weatherData = {
        location: apiResponse.resolvedAddress,
        currentConditions: apiResponse.currentConditions,
        days: apiResponse.days
    };
    console.log("Processed weather data:", weatherData);
    displayWeatherData(weatherData);
}

function displayWeatherData(weatherData) {
    const currentConditions = weatherData.currentConditions;
    
    // Update temperature
    document.querySelector('#temperature').textContent = `${Math.round(currentConditions.temp)}°F`;
    
    // Update condition
    document.querySelector('#condition').textContent = currentConditions.conditions;
    
    // Update location
    document.querySelector('#location-display').textContent = weatherData.location;
    
    // Update humidity
    document.querySelector('#humidity').textContent = `${Math.round(currentConditions.humidity)}%`;
    
    // Update wind speed
    document.querySelector('#wind-speed').textContent = `${Math.round(currentConditions.windspeed)} mph`;
    
    // change search icon to weather icon based on conditions
    const weatherIcon = document.querySelector('.search-icon');
    weatherIcon.classList.add('condition-icon');
    const iconAttribute = getWeatherIconAttribute(currentConditions.conditions);
    weatherIcon.setAttribute('data-lucide', iconAttribute);

    // Reinitialize the icon
    lucide.createIcons();
    
    // Show the weather display
    document.querySelector('#weather').classList.remove('hidden');
}

function getWeatherIconAttribute(condition) {
    const iconMap = {
        sunny: 'sun',
        clear: 'sun',
        cloud: 'cloud',
        rain: 'cloud-rain',
        snow: 'cloud-snow',
    };

    const normalizedCondition = condition.toLowerCase();
    for (const [key, value] of Object.entries(iconMap)) {
        if (normalizedCondition.includes(key)) {
            return value;
        }
    }
    return 'search'; // Fallback icon if no match
}

//add event listener to the form
formSubmit.addEventListener('submit', handleSubmit);