import React, { useEffect, useState } from "react";
import { fetchSeriesData } from "../services/seriesDataFetch";
import TableSeriesSearch from "./search/TableSeriesSearch";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Accordion, AccordionDetails, AccordionSummary, Breadcrumbs, Chip, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TreeTableSelector from "./select/TreeTableSelector";
import ListOperationSelector from "./select/ListOperationSelector";

const DataLookup = ({ onDataLookup }) => {

    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState({});

    useEffect(() => {
        setSelectedTable(null);
        setSelectedSeries({});
        onDataLookup([]);
    }, [selectedOperation]);

    useEffect(() => {
        setSelectedSeries({});
        onDataLookup([]);
    }, [selectedTable]);

    useEffect(() => {
        if (Object.keys(selectedSeries).length > 100) {
            const userConfirmed = window.confirm("Has seleccionado muchas variables, lo que podría afectar el rendimiento. ¿Quieres continuar?");
            if (!userConfirmed) {
                return;
            }
        }
        if (Object.keys(selectedSeries).length !== 0) {
            fetchSeriesData(selectedSeries)
                .then(data => {
                    console.log("Data fetched: ", data);
                    onDataLookup(data);
                })
                .catch(error => console.error("Error fetching series data:", error));
        }
    }, [selectedSeries]);

    return (
        <Accordion defaultExpanded sx={{ width: '100%', px: 3, py: 2 }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header">
                <Grid2 container spacing={4}>
                    <Grid2 item xs={12} display="flex" alignItems="flex-start" flexWrap="wrap">
                        <Breadcrumbs
                            separator={<NavigateNextIcon fontSize="small" />}
                            aria-label="breadcrumb"
                        >
                                <Chip
                                    sx={{
                                        height: 'auto',
                                        padding: '0.5rem',
                                        my: '0.5rem',
                                        '& .MuiChip-label': {
                                            display: 'block',
                                            whiteSpace: 'normal',
                                        },
                                    }}
                                    label={selectedOperation ? `Operación: ${selectedOperation.nombre}  → ID: ${selectedOperation.id}` : "Operación: No seleccionada"}
                                    variant="filled"
                                />
                            {selectedTable &&
                                <Chip
                                    sx={{
                                        height: 'auto',
                                        padding: '0.5rem',
                                        '& .MuiChip-label': {
                                            display: 'block',
                                            whiteSpace: 'normal',
                                        },
                                    }}
                                    label={selectedTable ? `Tabla: ${selectedTable.nombre}  → ID: ${selectedTable.id}` : "Tabla: No seleccionada"}
                                    variant="filled"
                                />
                            }
                        </Breadcrumbs>
                    </Grid2>
                </Grid2>
            </AccordionSummary>
            <AccordionDetails sx={{ pb: 4 }}>
                <Grid2 container spacing={4}>
                    <Grid2 xs={12} container spacing={4}>
                        <Grid2 item xs={12}>
                            <Typography variant="h5">Selecciona una operación estadística:</Typography>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <ListOperationSelector onOperationSelect={setSelectedOperation} />
                        </Grid2>
                    </Grid2>
                    {selectedOperation &&
                        <Grid2 xs={12} container spacing={4}>
                            <Grid2 item xs={12}>
                                <Typography variant="h5">Selecciona una tabla:</Typography>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TreeTableSelector
                                    operationId={selectedOperation.id}
                                    onTableSelect={setSelectedTable}
                                />
                            </Grid2>
                        </Grid2>
                    }
                    {selectedTable &&
                        <Grid2 xs={12} container spacing={4}>
                            <Grid2 item xs={12}>
                                <Typography variant="h5">Selecciona las variables relevantes de la tabla:</Typography>
                            </Grid2>
                            <Grid2 item xs={12}>
                                <TableSeriesSearch
                                    tableId={selectedTable.id}
                                    onSeriesSelect={setSelectedSeries}
                                />
                            </Grid2>
                        </Grid2>
                    }
                </Grid2>
            </AccordionDetails>
        </Accordion>
    );
}

export default DataLookup;
