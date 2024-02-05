// src/DataDisplay.tsx
import React, { useState, useEffect } from 'react';
import { fetchData } from './DataFetcher';
import { MyObject } from '../types/types';
import D3BarChart from './D3BarChart';

interface DataDisplayProps {
    cod: string;
    url: string;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ cod, url }) => {
    const [data, setData] = useState<MyObject | null>(null);

    useEffect(() => {
        fetchData(url).then(fetchedData => {
            const targetObject = fetchedData?.find(obj => obj.COD === cod);
            setData(targetObject || null);
        });
    }, [cod, url]);

    return (
        <div>
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
                    {/* Render the bar chart here */}
                    <D3BarChart data={data.Data} />
                </div>
            ) : (
                <p>No data found for COD: {cod}</p>
            )}
        </div>
    );
};

export default DataDisplay;
