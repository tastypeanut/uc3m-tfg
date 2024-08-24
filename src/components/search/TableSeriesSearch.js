import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/ineApi';
import { TableVariableGroupInfo } from "../../classes/info/TableVariableGroupInfo";
import { VariableInfo } from "../../classes/info/VariableInfo";
import Select from "react-select";
import { SeriesInfo } from "../../classes/info/SeriesInfo";
import { Box, Button, Card, Chip, Divider, LinearProgress, Stack, Typography } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const TableSeriesSearch = ({ tableId, onSeriesSelect }) => {
    const [tableGroups, setTableGroups] = useState([]);
    const [selectedValues, setSelectedValues] = useState({});

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!tableId) return;

        setLoading(true);
        setTableGroups([]); // Clear groups on table change
        setSelectedValues({}); // Clear selected values on table change

        // Fetch the main table groups first
        fetchData('GRUPOS_TABLA', tableId, {})
            .then(jsonData => {
                const groups = jsonData.map(item => TableVariableGroupInfo.fromJson(item)); // Deserialize TableGroup Data
                console.log("Table Variable Groups:", groups); //TODO: Remove
                setTableGroups(groups);

                // After setting groups, fetch values for each group
                return Promise.all(groups.map(group => {
                    const inputPath = `${tableId}/${group.id}`;
                    return fetchData('VALORES_GRUPOSTABLA', inputPath, {})
                        .then(valuesData => {
                            const values = valuesData.map(val => VariableInfo.fromJson(val)); // Deserialize Variable Data
                            console.log(`Values for group ${group.id}:`, values); //TODO: Remove
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
                            return group; // Return the group without options in case of error
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
            [group.id]: selectedOption
        }));
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

        console.log("Selected values:", selectedValues); //TODO: Remove

        let searchQuery = tableId + generateTableQueryString();
        let resultingSeries = {};

        setLoadingData(true);

        fetchData('SERIES_TABLA', searchQuery)
            .then(jsonData => {
                // Assuming jsonData is an array of series objects
                jsonData.forEach(item =>
                    resultingSeries[item.COD] = SeriesInfo.fromJson(item) // Deserialize Series Data
                );
                console.log("Search results:", jsonData); //TODO: Remove
            })
            .then(() => {
                onSeriesSelect(resultingSeries);
            })
            .catch(error => {
                setError(error);
                console.error("Failed to fetch search results:", error);
            })
            .finally(() => {
                setLoadingData(false);
            });
    };

    if (loading) return (
        <>
            <Typography variant="body1">Cargando información de la tabla...</Typography>
            <LinearProgress />
        </>
    );

    if (error) return (
        <>
            <Typography variant="body1">Error al cargar información de la tabla: {error.message}</Typography>
        </>
    );

    return (
        <Grid2 container spacing={4}>
            {tableGroups.map(group => (
                <Grid2 container key={group.id} xs={12} md={6} spacing={2} style={{ height: 'fit-content' }}>
                    <Grid2 xs={12} item>
                        <Typography variant="h6">{group.nombre}</Typography>
                    </Grid2>
                    <Grid2 xs={12} container spacing={2}>
                        <Grid2>
                            <Button variant="contained" size="small" onClick={() => handleSelectAll(group)}>Seleccionar todos los valores</Button>
                        </Grid2>
                        <Grid2>
                            <Button variant="outlined" size="small" onClick={() => handleDeselectAll(group)}>Borrar selección</Button>
                        </Grid2>
                    </Grid2>
                    <Grid2 xs={12} item>
                        <Select
                            isMulti
                            value={selectedValues[group.id]}
                            onChange={(option) => handleSelectChange(option, group)}
                            options={group.options}
                            placeholder="Busca y selecciona una variable..."
                            isClearable={true}
                            isSearchable={true}
                            disabled={loadingData}
                        />
                    </Grid2>
                </Grid2>
            ))}
            <Grid2 xs={12} item display="flex" justifyContent="center" alignItems="center">
                <Button variant="contained" size="large" startIcon={<QueryStatsIcon />} onClick={() => handleSeriesSearch()}>Obtener datos</Button>
            </Grid2>
            {loadingData &&
                <Grid2 xs={12} item>
                    <Typography variant="body1">Cargando datos de la tabla...</Typography>
                    <LinearProgress />
                </Grid2>
            }
        </Grid2>
    );
};

export default TableSeriesSearch;
