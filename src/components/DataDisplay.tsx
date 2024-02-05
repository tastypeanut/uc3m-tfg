import React, { useState, useEffect } from 'react';
import { fetchData } from './DataFetcher';
import { MyObject } from '../types/types';
import D3BarChart from './D3BarChart';

interface DataDisplayProps {
    url: string;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ url }) => {
    const [allData, setAllData] = useState<MyObject[]>([]);
    const [selectedCod, setSelectedCod] = useState<string>('');
    const [data, setData] = useState<MyObject | null>(null);

    useEffect(() => {
        fetchData(url).then(fetchedData => {
            if (fetchedData) {
                setAllData(fetchedData);
                if (fetchedData.length > 0) {
                    setSelectedCod(fetchedData[0].COD); // Default to the first COD
                }
            }
        });
    }, [url]);

    useEffect(() => {
        const targetObject = allData.find(obj => obj.COD === selectedCod);
        setData(targetObject || null);
    }, [selectedCod, allData]);

    return (
        <div>
            <div>
                <label htmlFor="cod-select">Choose a COD: </label>
                <select
                    id="cod-select"
                    value={selectedCod}
                    onChange={(e) => setSelectedCod(e.target.value)}
                >
                    {allData.map((obj, index) => (
                        <option key={index} value={obj.COD}>{obj.COD}</option>
                    ))}
                </select>
            </div>
            {data ? (
                <div>
                    <h2>Data for: {data.Nombre}</h2>
                    <div>
                        <ul>
                            {data.Data.map((entry, index) => (
                                <li key={index}>
                                    Fecha: {new Date(entry.Fecha).toLocaleDateString()}, Año: {entry.Anyo}, Valor: {entry.Valor}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <D3BarChart data={data.Data} />
                </div>
            ) : (
                <p>No data found for COD: {selectedCod}</p>
            )}
        </div>
    );
};

export default DataDisplay;
