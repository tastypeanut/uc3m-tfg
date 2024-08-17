import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/ineApi';
import {TableInfo} from "../../classes/info/TableInfo";
import {LinearProgress, Typography} from "@mui/material";

const TablesSelector = ({ operationId, onTableSelect }) => {
    const [tables, setTables] = useState([]); //Array of Table objects
    const [options, setOptions] = useState([]); //Map of operations to be used in the Select component
    const [selectedOption, setSelectedOption] = useState(null); //Selected operation in the Select component

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    useEffect(() => {
        if (operationId) {
            setLoading(true);
            setSelectedOption(null);  // Clear the selection when operation changes
            fetchData('TABLAS_OPERACION', operationId)
                .then(jsonData => {
                    setTables(jsonData.map(item => TableInfo.fromJson(item)));
                })
                .catch(error => {
                    setError(error);
                    console.error("Failed to fetch tables:", error);
                })
                .finally(() => {
                    setLoading(false)
                });
        }
    }, [operationId]);

    //On tables change, update the options with the new tables
    useEffect(() => {
        setOptions(tables.map(table => ({
            value: table.id,
            label: `${table.nombre} -> ID: ${table.id}`
        })))
        console.log("Available tables: ", tables); //TODO: Remove
    }, [tables]);

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onTableSelect(selectedOption ? selectedOption.value : null);
        console.log(selectedOption);
    }

    if (loading) return (
        <>
            <Typography variant="body1">Cargando tablas disponibles...</Typography>
            <LinearProgress/>
        </>
    );

    if (error) return (
        <>
            <Typography variant="body1">Error al cargar tablas disponibles: {error.message}</Typography>
        </>
    );

    return (
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                placeholder="Busca y selecciona una tabla..."
                isClearable={true}
                isSearchable={true}
            />
    );
};

export default TablesSelector;
