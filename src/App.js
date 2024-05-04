import React, { useEffect, useState } from "react";
import DataLookup from "./components/DataLookup";
import TableDisplay from "./components/display/TableDisplay";
import LineGraph from "./components/display/LineGraph";
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from "@mui/material/Unstable_Grid2";
import {Accordion, AccordionSummary, Button, Typography} from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

function App() {
    const [dataLookups, setDataLookups] = useState([{ id: 0 }]);
    const [retrievedData, setRetrievedData] = useState([]);
    const [normalizedData, setNormalizedData] = useState([]);

    const handleDataLookup = (index, newData) => {
        const updatedData = [...retrievedData];
        updatedData[index] = newData;
        setRetrievedData(updatedData);
        normalizeData(updatedData);
    }

    const addDataLookup = () => {
        const newId = dataLookups.length;
        setDataLookups([...dataLookups, { id: newId }]);
        setRetrievedData([...retrievedData, null]);
    }

    const normalizeData = (data) => {
        const flatData = data.reduce((acc, curr) => [...acc, ...(Array.isArray(curr) ? curr : [curr])], []);
        setNormalizedData(flatData);
    }

    //TODO: This is not working correctly
    /*
    // Function to delete a specific DataLookup
    const deleteDataLookup = (index) => {
        const newDataLookups = dataLookups.filter((_, i) => i !== index);
        const newRetrievedData = retrievedData.filter((_, i) => i !== index);
        setDataLookups(newDataLookups);
        setRetrievedData(newRetrievedData);
        normalizeData(newRetrievedData);
    }*/

    return (
        <Grid2>
            <h1>INE Data Viewer</h1>
            {dataLookups.map((lookup, index) => (
                <Accordion key={lookup.id} defaultExpanded>
                    <AccordionSummary
                        expandIcon={<ArrowDownwardIcon />}
                        aria-controls="panel1-content"
                        id="panel1-header"
                    >
                        <Typography>
                            <h1>Consulta {lookup.id}</h1>
                            {dataLookups.length > 1 &&
                                <Button variant="contained" size="small" /*onClick={() => deleteDataLookup(index)}*/>
                                    Borrar consulta
                                </Button>}
                        </Typography>
                    </AccordionSummary>
                    <DataLookup
                        key={lookup.id}
                        onDataLookup={(data) => handleDataLookup(index, data)}
                    />
                </Accordion>
            ))}
            {normalizedData.length > 0 && <button onClick={addDataLookup}>Add Data Lookup</button>}
            {normalizedData.length > 0 && <TableDisplay data={normalizedData}/>}
            {normalizedData.length > 0 && <LineGraph data={normalizedData}/>}
        </Grid2>
    );
}

export default App;
