import React, {useEffect, useState} from "react";
import {fetchSeriesData} from "../services/seriesDataFetch";
import OperationsSelector from "./select/OperationsSelector";
import TablesSelector from "./select/TablesSelector";
import TableSeriesSearch from "./search/TableSeriesSearch";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Accordion, AccordionDetails, AccordionSummary, Button, Chip, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NoDataLanding from "./display/NoDataLanding";
import QueryStatsIcon from "@mui/icons-material/QueryStats";


const DataLookup = ({ onDataLookup }) => {

    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState({});

    useEffect(() => {
        setSelectedTable(null);
        setSelectedSeries([]);
        onDataLookup([]);
    }, [selectedOperation]);

    useEffect(() => {
        setSelectedSeries([]);
        onDataLookup([]);
    }, [selectedTable]);

    //Fetch data for the selected series
    useEffect(() => {
        console.log("Selected series: ", selectedSeries);
        if (Object.keys(selectedSeries).length !== 0) {
            fetchSeriesData(selectedSeries)
                .then(data =>
                    console.log("Data fetched: ", data) ||
                    //setRetrievedData(data))
                    onDataLookup(data))
                .catch(error => console.error("Error fetching series data:", error));
        }
    }, [selectedSeries]);

    return (
            <Accordion defaultExpanded sx={{ width: '100%' }} sx={{px: 3, py: 2}}>
                <AccordionSummary expandIcon={<ExpandMoreIcon/>} aria-controls="panel1-content" id="panel1-header">
                    <Grid2 container spacing={4} >
                            <Grid2 item xs={12} display="flex" justifyContent="right" alignItems="center" sx={{ width: '100%' }}>
                                <Chip label={"Operación: " + selectedOperation} variant="outlined" /><Chip label={"Tabla: " + selectedTable} variant="outlined" />
                            </Grid2>
                    </Grid2>
                </AccordionSummary>
                <AccordionDetails sx={{pb: 4}}>
                    <Grid2 container spacing={4}>
                        <Grid2 xs={12} container spacing={4}>
                            <Grid2 item xs={12}>
                                <Typography variant="h5">Selecciona una operación:</Typography>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <OperationsSelector onOperationSelect={setSelectedOperation}/>
                            </Grid2>
                        </Grid2>
                        {selectedOperation &&
                            <Grid2 xs={12} container spacing={4}>
                                <Grid2 item xs={12}>
                                    <Typography variant="h5">Selecciona una tabla:</Typography>
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <TablesSelector operationId={selectedOperation} onTableSelect={setSelectedTable}/>
                                </Grid2>
                            </Grid2>
                        }
                        {selectedTable &&
                            <Grid2 xs={12} container spacing={4}>
                                <Grid2 item xs={12}>
                                    <Typography variant="h5">Selecciona las variables relevantes de la tabla:</Typography>
                                </Grid2>
                                <Grid2 item xs={12}>
                                    <TableSeriesSearch tableId={selectedTable} onSeriesSelect={setSelectedSeries}/>
                                </Grid2>
                            </Grid2>
                        }
                    </Grid2>
                </AccordionDetails>
            </Accordion>
    );
}

export default DataLookup;