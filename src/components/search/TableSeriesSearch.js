import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/ineApi';
import { TableGroup, TableGroupValue } from "../../classes/TableGroup";
import Select from "react-select";
import {SeriesInfo} from "../../classes/SeriesInfo";
import {Box, Button, Card, Chip, Divider, LinearProgress, Stack, Typography} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import Grid from "@mui/material/Unstable_Grid2";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const TableSeriesSearch = ({ tableId, onSeriesSelect }) => {
    const [tableGroups, setTableGroups] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        if (!tableId) return;

        setLoading(true);

        const abortController = new AbortController(); // For aborting fetch requests on cleanup

        setTableGroups([]); // Clear groups on table change
        setSelectedValues({}); // Clear selected values on table change

        // Fetch the main table groups first
        fetchData('GRUPOS_TABLA', tableId, {}, abortController.signal)
            .then(jsonData => {

                const groups = jsonData.map(item => new TableGroup(item.Id, item.Nombre));
                setTableGroups(groups);

                // After setting groups, fetch values for each group
                return Promise.all(groups.map(group => {

                    const inputPath = `${tableId}/${group.id}`;
                    return fetchData('VALORES_GRUPOSTABLA', inputPath, {}, abortController.signal)
                        .then(valuesData => {
                            const values = valuesData.map(val =>
                                new TableGroupValue(val.Id, val.Nombre, val.Codigo, val.Fk_Variable)
                            );
                            return {
                                ...group,
                                options: values.map(value => ({
                                    value: value.id,
                                    fkVariable: value.fkVariable,
                                    label: `${value.nombre} -> ID: ${value.id}`
                                }))
                            };
                        })
                        .catch(error => {
                            console.error(`Failed to fetch values for group ${group.id}:`, error);
                            return group; // Return group without options on failure
                        });
                }));
            })
            .then(updatedGroups => {
                // Set the groups with options after all have been fetched
                setTableGroups(updatedGroups);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });

        return () => {
            abortController.abort(); // Cleanup function to abort fetches on component unmount or dependency change
        };

    }, [tableId]); // Trigger only when tableId changes

    const generateTableQueryString = () => { //TODO: Move this to a helper function
        let parameters = [];
        Object.entries(selectedValues).forEach(([groupId, selectedOptions]) => {
            if (Array.isArray(selectedOptions)) {
                selectedOptions.forEach(option => {
                    // Create the parameter string for each option
                    parameters.push(`tv=${option.fkVariable}:${option.value}`);
                });
            }
        });
        // Join all parameters with '&' and prepend with '?'
        const searchString = "?" + parameters.join('&');
        console.log(searchString); //TODO: Remove
        return searchString;
    }

    const handleSelectChange = (selectedOption, group) => {
        setSelectedValues(prev => ({
            ...prev,
            [group.id]: selectedOption}));
    };

    const handleSelectAll = (group) => {
        setSelectedValues(prev => ({
            ...prev,
            [group.id]: group.options
        }));
    };

    const handleDeselectAll = (group) => {
        setSelectedValues(prev => ({
            ...prev,
            [group.id]: []
        }));
    };

    const handleSeriesSearch = () => { //TODO: Move this to a helper function
        let searchQuery = tableId + generateTableQueryString();
        let resultingSeries = {};
        fetchData('SERIES_TABLA', searchQuery)
            .then(jsonData => {
                // Assuming jsonData is an array of series objects
                jsonData.forEach(item =>
                    resultingSeries[item.COD] = new SeriesInfo(item.COD, item.Decimales, item.FK_Clasificacion, item.FK_Escala, item.FK_Operacion, item.FK_Periodicidad, item.FK_Publicacion, item.FK_Unidad, item.Id, item.Nombre)
                );
                console.log("Search results:", jsonData); //TODO: Remove
            })
            .catch(error => {
                console.error("Failed to fetch search results:", error);
            })
            .finally(() => {
                onSeriesSelect(resultingSeries);
            });
    };

    if (loading) return (
        <>
            <p>Cargando información de la tabla...</p>
            <LinearProgress />
        </>
    );

    if (error) return (
        <>
            <p>Error al cargar información de la tabla: {error.message}</p>
        </>
    );

    return (
        <Grid2 container>
            {tableGroups.map(group => (
                <Grid2 xs={6} container key={group.id} >
                    <Grid2 xs={12}>
                        <h3>{group.nombre}</h3>
                    </Grid2>
                    <Grid2 xs={9}>
                        <Select
                            isMulti
                            value={selectedValues[group.id]}
                            onChange={(option) => handleSelectChange(option, group)}
                            options={group.options}
                            placeholder="Search and select a variable..."
                            isClearable={true}
                            isSearchable={true}
                        />
                    </Grid2>
                    <Grid2 xs={12}>
                        <Button variant="contained" size="small" onClick={() => handleSelectAll(group)}>Seleccionar todos los valores</Button>
                        <Button variant="contained" size="small" onClick={() => handleDeselectAll(group)}>Quitar selección</Button>
                    </Grid2>
                </Grid2>
            ))}
            <Grid2 xs={12}>
                <Button variant="contained" size="large" startIcon={<QueryStatsIcon/>} onClick={() => handleSeriesSearch()}>Obtener datos</Button>
            </Grid2>
        </Grid2>
    );
};

export default TableSeriesSearch;