import React, { useMemo } from 'react';

// Helper function to convert Unix timestamp to a readable date
const formatDate = (unixTimestamp) => {
    return new Date(unixTimestamp * 1000).toLocaleDateString("en-US");
};

const DataTable = ({ data }) => {
    const years = useMemo(() => {
        const yearSet = new Set();
        data.forEach(record => {
            record.data.forEach(dp => {
                yearSet.add(dp.anyo);
            });
        });
        return Array.from(yearSet).sort();
    }, [data]);

    const dataMap = useMemo(() => {
        const map = new Map(); // Maps nombre to a Map of anyo to valor
        data.forEach(record => {
            let innerMap = map.get(record.nombre) || new Map();
            record.data.forEach(dp => {
                innerMap.set(dp.anyo, dp.valor);
            });
            map.set(record.nombre, innerMap);
        });
        return map;
    }, [data]);

    const renderTableHeader = () => (
        <tr>
            <th>Nombre</th>
            {years.map(year => (
                <th key={year}>{year}</th>
            ))}
        </tr>
    );

    const renderTableData = () => (
        Array.from(dataMap, ([nombre, yearMap]) => (
            <tr key={nombre}>
                <td>{nombre}</td>
                {years.map(year => (
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
