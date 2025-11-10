import axios from 'axios';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configure environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '.env') });

const API_KEY = process.env.OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

async function getWeather(city) {
    try {
        // Input validation
        if (!city) {
            throw new Error('Please provide a city name. Usage: node index.js "city name"');
        }

        if (!API_KEY) {
            throw new Error('API key not found. Please set OPENWEATHERMAP_API_KEY in .env file');
        }

        // Make API request
        const response = await axios.get(BASE_URL, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric' // Use Celsius for temperature
            }
        });

        const { main, weather } = response.data;
        
        // Format the output as requested
        console.log(`Weather in ${city}: ${Math.round(main.temp)}°C, ${weather[0].description}`);

    } catch (error) {
        if (error.response) {
            // API-specific error handling
            if (error.response.status === 404) {
                console.error(`Error: City "${city}" not found`);
            } else {
                console.error(`Error: ${error.response.data.message}`);
            }
        } else if (error.message) {
            // General error handling
            console.error(`Error: ${error.message}`);
        } else {
            console.error('An unexpected error occurred');
        }
        process.exit(1);
    }
}

// Get city name from command line arguments
const city = process.argv[2];
getWeather(city);