import {Record} from "../classes/data/SeriesData";

//const BASE_URL = 'https://inestat.com/api/ES';
//const BASE_URL = 'https://servicios.ine.es/wstempus/js/ES'; //Original INE API URL, compatible with implementation done. If worker fails, emergency switch to this.
const BASE_URL = 'https://api.inestat.com/wstempus/js/ES';

const cache = {};

export const fetchData = async (functionName, input, params = {}, signal) => {
    const url = new URL(`${BASE_URL}/${functionName}/${input}`);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));
    const cacheKey = url.toString();

    if (cache[cacheKey]) {
        return cache[cacheKey];
    }

    try {
        const response = await fetch(url, { signal });
        if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
        }
        const data = await response.json();
        cache[cacheKey] = data;  // Store response in cache
        return data;
    } catch (error) {
        if (error.name !== 'AbortError') {
            console.error("API call failed:", error);
        }
        throw error;
    }
};

//Wrapper function to fetch data for multiple series
export async function fetchSeriesData(seriesMap) {
    const fetchPromises = [];

    for (const [key, value] of Object.entries(seriesMap)) {

        const searchString = key + "?nult=100000&det=2";

        // Create a promise for each fetchData call and push it into the fetchPromises array
        const fetchPromise = fetchData('DATOS_SERIE', searchString).then(item => {
            const seriesRecords = Record.fromJson(item);
            console.log(`Fetched data for series ${key}:`, seriesRecords);
            return seriesRecords; // We return seriesRecords from the then callback to use later
        }).catch(error => {
            console.error(`Failed to fetch data for series ${key}:`, error);
            // Optionally handle errors individually here or just propagate them
            return null; // You might want to return null or some default object in case of error
        });

        fetchPromises.push(fetchPromise);
    }

    // Wait for all the fetch promises to resolve
    const records = await Promise.all(fetchPromises);

    // Filter out any null values if errors were returned as null
    return records.filter(record => record !== null);
}