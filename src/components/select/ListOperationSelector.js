import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/ineApi';
import { OperationInfo } from "../../classes/info/OperationInfo";
import {Button, LinearProgress, Typography} from "@mui/material";

const ListOperationSelector = ({ onOperationSelect }) => {
    const [options, setOptions] = useState([]); // Operations options for the Select component
    const [selectedOption, setSelectedOption] = useState(null); // Selected operation in the Select component

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // On component load, fetch available operations
    useEffect(() => {
        const loadOperations = async () => {
            setLoading(true);
            setSelectedOption(null);  // Clear the selection on component load
            try {
                const jsonData = await fetchData('OPERACIONES_DISPONIBLES', '', {});
                const operations = jsonData.map(item => {
                    const operation = OperationInfo.fromJson(item);
                    return {
                        value: operation, // Set the entire operation object as the value
                        label: `${operation.nombre} → ID: ${operation.id}`
                    };
                });

                // Sort the operations by the label property
                operations.sort((a, b) => a.label.localeCompare(b.label));

                setOptions(operations);
            } catch (error) {
                setError(error);
                console.error("Failed to fetch operations:", error);
            } finally {
                setLoading(false);
            }
        };

        loadOperations();
    }, []);

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onOperationSelect(selectedOption ? selectedOption.value : null);
        console.log(selectedOption?.value);
    };

    if (loading) return (
        <>
            <Typography variant="body1">Cargando operaciones disponibles...</Typography>
            <LinearProgress />
        </>
    );

    if (error) return (
        <>
            <Typography variant="body1" color="error">Error al cargar operaciones disponibles: {error.message}</Typography>
        </>
    );

    return (
        <Select
            value={selectedOption}
            onChange={handleSelectChange}
            options={options}
            placeholder="Busca y selecciona una operación..."
            isClearable={true}
            isSearchable={true}
        />
    );
};

export default ListOperationSelector;
