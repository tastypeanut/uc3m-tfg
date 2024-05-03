import React, { useMemo } from 'react';

// Helper function to convert Unix timestamp to a readable date
const formatDate = (unixTimestamp) => {
    return new Date(unixTimestamp).toLocaleDateString("es-ES");
};

const DataTable = ({ data }) => {

    //Create a set of dates from the data
    const dates = useMemo(() => {
        const dateSet = new Set();
        data.forEach(record => {
            record.data.forEach(dp => {
                dateSet.add(formatDate(dp.fecha));
                console.log(formatDate(dp.fecha));
            });
        });
        return Array.from(dateSet).sort();
    }, [data]);

    //Map data to the set of dates, so we can render it easily
    const dataMap = useMemo(() => {
        const map = new Map();
        data.forEach(record => {
            let innerMap = map.get(record.nombre) || new Map();
            record.data.forEach(dp => {
                innerMap.set(formatDate(dp.fecha), dp.valor);
            });
            map.set(record.nombre, innerMap);
        });
        return map;
    }, [data]);

    const renderTableHeader = () => (
        <tr>
            <th>Nombre</th>
            {dates.map(year => (
                <th key={year}>{year}</th>
            ))}
        </tr>
    );

    const renderTableData = () => (
        Array.from(dataMap, ([nombre, yearMap]) => (
            <tr key={nombre}>
                <td>{nombre}</td>
                {dates.map(year => (
                    <td key={`${nombre}-${year}`}>{yearMap.get(year) || '-'}</td>
                ))}
            </tr>
        ))
    );

    return (
        <table>
            <thead>
            {renderTableHeader()}
            </thead>
            <tbody>
            {renderTableData()}
            </tbody>
        </table>
    );
};

export default DataTable;
