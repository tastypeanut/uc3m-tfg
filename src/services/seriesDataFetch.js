import { fetchData } from "./ineApi";
import { Record } from "../classes/TableData";

export async function fetchSeriesData(seriesMap) {
    const fetchPromises = [];

    for (const [key, value] of Object.entries(seriesMap)) {

        const searchString = key + "?nult=100000";

        // Create a promise for each fetchData call and push it into the fetchPromises array
        const fetchPromise = fetchData('DATOS_SERIE', searchString).then(item => {
            const seriesRecords = new Record(item.COD, item.Nombre, item.FK_Unidad, item.FK_Escala, item.Data);
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
