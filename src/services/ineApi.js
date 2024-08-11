const BASE_URL = 'https://tfg.enrique.wtf/api/ES';
//const BASE_URL = 'https://servicios.ine.es/wstempus/js/ES/';
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
