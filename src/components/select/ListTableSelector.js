import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/ineApi';
import { TableInfo } from "../../classes/info/TableInfo";
import { LinearProgress, Typography } from "@mui/material";

const ListTableSelector = ({ operationId, onTableSelect }) => {
    const [options, setOptions] = useState([]); // Tables options for the Select component
    const [selectedOption, setSelectedOption] = useState(null); // Selected table in the Select component

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (operationId) {
            setLoading(true);
            setSelectedOption(null);  // Clear the selection when operation changes
            fetchData('TABLAS_OPERACION', operationId)
                .then(jsonData => {
                    const tables = jsonData.map(item => {
                        const table = TableInfo.fromJson(item);
                        return {
                            value: table, // Set the entire table object as the value
                            label: `${table.nombre} -> ID: ${table.id}`
                        };
                    });

                    // Sort the tables by the label property
                    tables.sort((a, b) => a.label.localeCompare(b.label));

                    setOptions(tables);
                })
                .catch(error => {
                    setError(error);
                    console.error("Failed to fetch tables:", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [operationId]);

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onTableSelect(selectedOption ? selectedOption.value : null);
        console.log(selectedOption?.value);
    };

    if (loading) return (
        <>
            <Typography variant="body1">Cargando tablas disponibles...</Typography>
            <LinearProgress />
        </>
    );

    if (error) return (
        <>
            <Typography variant="body1" color="error">Error al cargar tablas disponibles: {error.message}</Typography>
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

export default ListTableSelector;
