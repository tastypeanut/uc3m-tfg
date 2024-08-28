import React, {useState, useCallback, useMemo, useEffect} from "react";
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

const useDataManagement = () => {
    const [dataLookups, setDataLookups] = useState([{ id: 0 }]);
    const [retrievedData, setRetrievedData] = useState([]);

    const handleDataLookup = useCallback((index, data) => {
        setRetrievedData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index] = data;
            return updatedData;
        });
    }, []);

    const addDataLookup = useCallback(() => {
        setDataLookups((prevLookups) => [
            ...prevLookups,
            { id: prevLookups.length },
        ]);
        setRetrievedData((prevData) => [...prevData, null]);
    }, []);

    // Log retrievedData whenever it changes
    useEffect(() => {
        console.log("Retrieved Data:", retrievedData);
    }, [retrievedData]);

    return { dataLookups, handleDataLookup, addDataLookup, retrievedData };
};

const StatisticsToolPage = () => {

    const { dataLookups, handleDataLookup, addDataLookup, retrievedData } = useDataManagement();

    const dataIsAvailable = useMemo(() => retrievedData.length > 0, [retrievedData]);

    return (
        <Grid2 container xs={12} rowSpacing={4} sx={{ px: { xs: 2, sm: 3, md: 4 }, py: { xs: 3, sm: 4 }}}>
            <Grid2 item xs={12}>
                <Typography variant="h4" py={1}>Bienvenid@</Typography>
                <Typography variant="h5" py={1}>INESTAT es una herramienta de consulta de datos estadísticos del INE</Typography>
                <Divider variant="left" pt={4}/>
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
                <>
                    {/*
                    <Grid2 item xs={12}>
                        <TimeSeriesChart normalizedData={normalizedData}/>
                    </Grid2>
                    <Grid2 item xs={12}>
                        <DataExport normalizedData={normalizedData}/>
                    </Grid2>
            */}
                    <Grid2 item xs={12}>
                        <TableDisplay flatData={retrievedData}/>
                    </Grid2>
                </>

            ) : (
                <NoDataLanding/>
            )}
        </Grid2>
    );
};

export default StatisticsToolPage;
