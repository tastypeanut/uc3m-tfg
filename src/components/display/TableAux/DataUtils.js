import { v4 as uuidv4 } from 'uuid';

export function parseDataDate(data) {
    const year = data.anyo;
    const month = parseInt(data.periodo.mesInicio, 10) - 1; // Adjust for zero-indexed months
    const day = parseInt(data.periodo.diaInicio, 10);
    return new Date(year, month, day).toLocaleDateString("es-ES");
}

export function processData(flatData) {
    const seriesInfo = [];
    const seriesData = [];
    const dates = new Set();

    flatData.forEach((record) => {
        if (record.length === 0) {
            return;
        }

        record.seriesWithDataArray.forEach((series) => {

            const seriesInfoTemp = {
                id: 'queryID:' + uuidv4(), // Unique ID for each row
                nombreOperacion: record.operationInfo.nombre,
                idOperacion: record.operationInfo.id,
                nombreTabla: record.tableInfo.nombre,
                idTabla: record.tableInfo.id,
                nombreSerie: series.nombre,
                codSerie: series.cod,
                unidad: series.unidad.nombre,
            };

            const seriesDataTemp = {};

            series.data.forEach((dataPoint) => {
                const date = parseDataDate(dataPoint); // Convert dataPoint to date string
                dates.add(date);

                if (dataPoint.valor === null || dataPoint.valor === undefined) {
                    seriesDataTemp[date] = 'N/D'; // No data available
                } else {
                    seriesDataTemp[date] = dataPoint.valor; // Assign the value to the date column
                }
            });

            seriesInfo.push(seriesInfoTemp);
            seriesData.push(seriesDataTemp);
        });
    });

    const dateArray = Array.from(dates).sort((a, b) => new Date(b) - new Date(a));

    console.log("DataUtils: ", seriesInfo, seriesData, dateArray);

    return { seriesInfo: seriesInfo, seriesData: seriesData, dateArray: dateArray};
}
