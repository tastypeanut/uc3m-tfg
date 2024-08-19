import React, { useState, useCallback, useMemo } from "react";
import DataLookup from "./DataLookup";
import TableDisplay from "./display/TableDisplay";
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from "@mui/material/Unstable_Grid2";
import { Button, Typography } from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NoDataLanding from "./display/NoDataLanding";
import DataExport from "./DataExport";
import Heatmap from "./display/Heatmap";
import RadarChart from "./display/RadarChart";
import TimeSeriesChart from "./display/TimeSeriesChart";

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

const StatisticsToolPage = () => {

    const { dataLookups, normalizedData, handleDataLookup, addDataLookup } = useDataManagement();

    const dataIsAvailable = useMemo(() => normalizedData.length > 0, [normalizedData]);

    return (
        <Grid2 container xs={12} rowSpacing={4} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 }}}>
            <Grid2 item xs={12}>
                <Typography variant="h3">INE Data Viewer</Typography>
            </Grid2>
            <Grid2 container xs={12} height='100%' width='100%'>
                <script async
                        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1401877082227954"
                        crossOrigin="anonymous"></script>
                <ins class="adsbygoogle"
                     data-ad-client="ca-pub-1401877082227954"
                     data-ad-slot="3430706715"
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
                <script>
                    (adsbygoogle = window.adsbygoogle || []).push({});
                </script>
            </Grid2>
            {dataLookups.map((lookup, index) => (
                <Grid2 item xs={12} key={lookup.id}>
                    <DataLookup onDataLookup={(data) => handleDataLookup(index, data)} />
                </Grid2>
            ))}
            <Grid2 item xs={12} display="flex" justifyContent="right" alignItems="center">
                <Button variant="contained" size="large" color="success" startIcon={<AddCircleIcon />} onClick={addDataLookup}>
                    Añadir consulta
                </Button>
            </Grid2>
            {dataIsAvailable ? (
                console.log(normalizedData),
                <Grid2 container spacing={4}>
                    <Grid2 item xs={12}>
                        <TimeSeriesChart normalizedData={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12}>
                        <DataExport normalizedData={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TableDisplay normalizedData={normalizedData}/>
                    </Grid2>
                </Grid2>
            ) : (
                <NoDataLanding />
            )}
        </Grid2>
    );
};

export default StatisticsToolPage;
