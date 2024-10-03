import React, { useState, useCallback, useMemo } from "react";
import DataLookup from "../components/DataLookup";
import TableDisplay from "../components/display/TableDisplay";
import CssBaseline from '@mui/material/CssBaseline';
import Grid2 from "@mui/material/Unstable_Grid2";
import {Button, Divider, Typography} from "@mui/material";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NoDataLanding from "../components/display/NoDataLanding";
import DataExport from "../components/DataExport";
import Heatmap from "../components/display/Heatmap";
import RadarChart from "../components/display/RadarChart";
import TimeSeriesChart from "../components/display/TimeSeriesChart";

// Custom Hook for Data Management
const useDataManagement = () => {
    const [dataLookups, setDataLookups] = useState([{ id: 0 }]);
    const [retrievedData, setRetrievedData] = useState([]);
    const [normalizedData, setNormalizedData] = useState([]);

    // Memoize normalization to avoid recalculating unless retrievedData changes
    const normalizeData = useCallback((data) => {
        return data.reduce((acc, curr) => [...acc, ...(Array.isArray(curr) ? curr : [curr])], []);
    }, []);

    const handleDataLookup = useCallback((index, newData) => {
        setRetrievedData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = newData;

            // Normalize data immediately and set it in one go
            const normalized = normalizeData(updatedData);
            setNormalizedData(normalized);

            return updatedData;
        });
    }, [normalizeData]);

    const addDataLookup = useCallback(() => {
        setDataLookups((prevLookups) => [...prevLookups, { id: prevLookups.length }]);
        setRetrievedData((prevData) => [...prevData, null]);
    }, []);

    return { dataLookups, normalizedData, handleDataLookup, addDataLookup };
};

const StatisticsToolPage = () => {

    const { dataLookups, normalizedData, handleDataLookup, addDataLookup } = useDataManagement();

    const dataIsAvailable = useMemo(() => normalizedData.length > 0, [normalizedData]);

    return (
        <Grid2 container xs={12} rowSpacing={4} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 }}}>
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
                <>
                    <Grid2 item xs={12}>
                        <TimeSeriesChart normalizedData={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12}>
                        <DataExport normalizedData={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12}>
                        <TableDisplay normalizedData={normalizedData}/>
                    </Grid2>
                </>

            ) : (
                <Grid2 item xs={12}>
                    <NoDataLanding/>
                </Grid2>
            )}

        </Grid2>
    );
};

export default StatisticsToolPage;
