import React, {useEffect, useRef, useState} from "react";
import TableSeriesSearch from "./search/TableSeriesSearch";
import Grid2 from "@mui/material/Unstable_Grid2";
import {Accordion, AccordionDetails, AccordionSummary, Breadcrumbs, Chip, Typography} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import TreeTableSelector from "./select/TreeTableSelector";
import ListOperationSelector from "./select/ListOperationSelector";
import {fetchSeriesData} from "../services/ineApi";
import { v4 as uuidv4 } from 'uuid';

const DataLookup = ({ operationId, onDataLookup }) => {

    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState({});

    // Effect to reset table and series when operation changes
    useEffect(() => {
        console.log("Operation changed, resetting table, series, and data");
        setSelectedTable(null);
        setSelectedSeries({});
        onDataLookup([]);
    }, [selectedOperation]);

    // Effect to reset series when table changes
    useEffect(() => {
        console.log("Table changed, resetting series and data.");
        setSelectedSeries({});
        onDataLookup([]);
    }, [selectedTable]);

    // Effect to fetch series data when series selection changes
    useEffect(() => {
        if (Object.keys(selectedSeries).length !== 0) {

            console.log("Series selection changed, fetching data.");

            if (Object.keys(selectedSeries).length > 100) {
                const userConfirmed = window.confirm("Has seleccionado muchas variables, lo que podría afectar el rendimiento. ¿Quieres continuar?");
                if (!userConfirmed) {
                    return;
                }
            }

            fetchSeriesData(selectedSeries)
                .then(data => {
                    console.log("Data fetched: ", data);
                    onDataLookup({ queryId: uuidv4(), operationInfo: selectedOperation, tableInfo: selectedTable, seriesWithDataArray: data });
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
                            <ListOperationSelector
                                operationId={operationId}
                                onOperationSelect={setSelectedOperation}
                            />
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
