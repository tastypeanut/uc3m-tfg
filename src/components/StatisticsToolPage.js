import React, { useState, useCallback, useMemo } from "react";
import DataLookup from "./DataLookup";
import TableDisplay from "./display/TableDisplay";
import LineGraph from "./display/LineGraph";
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from "@mui/material/Unstable_Grid2";
import { Button, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NoDataLanding from "./display/NoDataLanding";
import DataExport from "./DataExport";

// Custom Hook for Data Management
const useDataManagement = () => {
    const [dataLookups, setDataLookups] = useState([{ id: 0 }]);
    const [retrievedData, setRetrievedData] = useState([]);
    const [normalizedData, setNormalizedData] = useState([]);

    const handleDataLookup = useCallback((index, newData) => {
        const updatedData = [...retrievedData];
        updatedData[index] = newData;
        setRetrievedData(updatedData);
        normalizeData(updatedData);
    }, [retrievedData]);

    const addDataLookup = useCallback(() => {
        const newId = dataLookups.length;
        setDataLookups([...dataLookups, { id: newId }]);
        setRetrievedData([...retrievedData, null]);
    }, [dataLookups, retrievedData]);

    const normalizeData = useCallback((data) => {
        try {
            const flatData = data.reduce((acc, curr) => [...acc, ...(Array.isArray(curr) ? curr : [curr])], []);
            setNormalizedData(flatData);
        } catch (error) {
            console.error("Error normalizing data:", error);
        }
    }, []);

    return { dataLookups, normalizedData, handleDataLookup, addDataLookup };
};

// Style Constants
const containerStyle = { p: 5, m: 0 };
const itemStyle = { px: 0 };
const buttonStyle = { px: 0, display: "flex", justifyContent: "right", alignItems: "center" };

const StatisticsToolPage = () => {

    const { dataLookups, normalizedData, handleDataLookup, addDataLookup } = useDataManagement();

    const dataIsAvailable = useMemo(() => normalizedData.length > 0, [normalizedData]);

    return (
        <Grid2 container spacing={4} sx={containerStyle}>
            <CssBaseline />
            <Grid2 item xs={12} sx={itemStyle}>
                <Typography variant="h3">INE Data Viewer</Typography>
            </Grid2>
            {dataLookups.map((lookup, index) => (
                <Grid2 item xs={12} sx={itemStyle} key={lookup.id}>
                    <DataLookup onDataLookup={(data) => handleDataLookup(index, data)} />
                </Grid2>
            ))}
            <Grid2 item xs={12} sx={buttonStyle}>
                <Button variant="contained" size="large" color="success" startIcon={<AddCircleIcon />} onClick={addDataLookup}>
                    Añadir consulta
                </Button>
            </Grid2>
            {dataIsAvailable ? (
                console.log(normalizedData),
                <>
                    <Grid2 item xs={12} sx={itemStyle}>
                        <DataExport normalizedData={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12} sx={itemStyle}>
                        <TableDisplay data={normalizedData} />
                    </Grid2>
                    <Grid2 item xs={12} sx={itemStyle}>
                        <LineGraph data={normalizedData} />
                    </Grid2>
                </>
            ) : (
                <NoDataLanding />
            )}
        </Grid2>
    );
};

export default StatisticsToolPage;
