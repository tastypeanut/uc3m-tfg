import { useEffect, useState } from "react";
import './App.css';
import DataLookup from "./components/DataLookup";
import TableDisplay from "./components/display/TableDisplay";
import LineGraph from "./components/display/LineGraph";

function App() {
    // Initialize with one DataLookup by default
    const [dataLookups, setDataLookups] = useState([{ id: 0 }]);
    const [retrievedData, setRetrievedData] = useState([null]);
    const [normalizedData, setNormalizedData] = useState([]);

    // Function to handle data retrieved from any DataLookup
    const handleDataLookup = (index, newData) => {
        const updatedData = [...retrievedData];
        updatedData[index] = newData; // Update specific index with new data
        setRetrievedData(updatedData);

        // Normalize the data
        normalizeData(updatedData);
    }

    // Function to add a new DataLookup
    const addDataLookup = () => {
        const newId = dataLookups.length;
        setDataLookups([...dataLookups, { id: newId }]);
        setRetrievedData([...retrievedData, null]); // Append null for new lookup
    }

    // Function to normalize data
    const normalizeData = (data) => {
        const flatData = data.reduce((acc, curr) => {
            if (Array.isArray(curr)) {
                return acc.concat(curr); // Concatenate if current item is an array
            } else if (curr && typeof curr === 'object') {
                return acc.concat(Object.values(curr)); // Concatenate values if object
            }
            return acc.concat(curr); // Concatenate direct values
        }, []);
        setNormalizedData(flatData);
    }

    return (
        <div>
            {dataLookups.map((lookup, index) => (
                <DataLookup
                    key={lookup.id}
                    onDataLookup={(data) => handleDataLookup(index, data)}
                />
            ))}
            <button onClick={addDataLookup}>Add Data Lookup</button>
            <div>
                <h2>Aggregated Data:</h2>
                {JSON.stringify(retrievedData)}
                <h2>Normalized Data:</h2>
                {JSON.stringify(normalizedData)}
            </div>
            <TableDisplay data={normalizedData}/>
            <LineGraph records={normalizedData}/>
        </div>
    );
}

export default App;
