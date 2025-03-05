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

// Location Autocomplete Functionality
const locationInput = document.getElementById('location-input');
const suggestionsContainer = document.createElement('div');
suggestionsContainer.id = 'suggestions-container';
suggestionsContainer.classList.add('suggestions-container');
locationInput.parentNode.insertBefore(suggestionsContainer, locationInput.nextSibling);

// RapidAPI credentials for GeoDB Cities
const geoDbApiKey = '6c653f67cdmsh4389fcb6e291077p13595fjsnc34b865cae90'; // Replace with your actual RapidAPI key

async function fetchLocationSuggestions(query) {
    if (query.length < 2) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
        return;
    }

    try {
        const response = await fetch(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${query}&types=CITY&limit=5`, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': geoDbApiKey,
                'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
            }
        });

        const data = await response.json();
        displaySuggestions(data.data);
    } catch (error) {
        console.error('Error fetching location suggestions:', error);
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
    }
}

function displaySuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';

    if (suggestions && suggestions.length > 0) {
        suggestions.forEach(location => {
            const suggestionItem = document.createElement('div');
            suggestionItem.classList.add('suggestion-item');
            suggestionItem.textContent = `${location.city}, ${location.country}`;

            suggestionItem.addEventListener('click', () => {
                locationInput.value = `${location.city}, ${location.country}`;
                suggestionsContainer.innerHTML = '';
                suggestionsContainer.classList.remove('show');

                // Trigger form submission
                formSubmit.dispatchEvent(new Event('submit'));
            });

            suggestionsContainer.appendChild(suggestionItem);
        });

        suggestionsContainer.classList.add('show');
    } else {
        suggestionsContainer.classList.remove('show');
    }
}

// Debounce function to limit API calls
function debounce(func, delay) {
    let timeoutId;
    return function () {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// Add event listener for input
const debouncedSuggestions = debounce(function () {
    fetchLocationSuggestions(this.value);
}, 300);

locationInput.addEventListener('input', debouncedSuggestions);

// Close suggestions when clicking outside
document.addEventListener('click', (event) => {
    if (!suggestionsContainer.contains(event.target) && event.target !== locationInput) {
        suggestionsContainer.innerHTML = '';
        suggestionsContainer.classList.remove('show');
    }
});
