import React, { useEffect, useState } from "react";
import DataLookup from "./components/DataLookup";
import TableDisplay from "./components/display/TableDisplay";
import LineGraph from "./components/display/LineGraph";
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from "@mui/material/Unstable_Grid2";
import {Accordion, AccordionSummary, Button, Typography} from "@mui/material";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {AddCircle} from "@mui/icons-material";
import NoDataLanding from "./components/display/NoDataLanding";

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
        <Grid2 container spacing={4} sx={{ p: 5, m: 0}}>
            <Grid2 item xs={12} sx={{ px: 0 }}>
                <Typography variant="h3">INE Data Viewer</Typography>
            </Grid2>
            {dataLookups.map((lookup, index) => (
                <Grid2 item xs={12} sx={{ px: 0 }}>
                    <DataLookup
                            key={lookup.id}
                            onDataLookup={(data) => handleDataLookup(index, data)}
                        />
                </Grid2>
            ))}
            <Grid2 item xs={12} sx={{ px: 0 }} display="flex" justifyContent="right" alignItems="center">
                <Button variant="contained" size="large" color="success" startIcon={<AddCircle/>} onClick={addDataLookup}>Añadir consulta</Button>
            </Grid2>
            {normalizedData.length > 0 &&
                <>
                    <Grid2 item xs={12} sx={{ px: 0 }}>
                        <TableDisplay data={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12} sx={{ px: 0 }}>
                        <LineGraph data={normalizedData}/>
                    </Grid2>
                </>
            }
            {normalizedData.length <= 0 &&
                <NoDataLanding/>
            }
        </Grid2>
    );
}

export default App;
