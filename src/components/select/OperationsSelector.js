import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/ineApi';
import {Operation} from "../../classes/Operation";
import {Box, CircularProgress, LinearProgress, Skeleton} from "@mui/material";

const OperationsSelector = ({ onOperationSelect }) => {
    const [operations, setOperations] = useState([]); //Array of Operation objects
    const [options, setOptions] = useState([]); //Map of operations to be used in the Select component
    const [selectedOption, setSelectedOption] = useState(null); //Selected operation in the Select component

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    // On component load, fetch available operations
    useEffect(() => {
        setLoading(true);
        setSelectedOption(null);  // Clear the selection on component load
        fetchData('OPERACIONES_DISPONIBLES', '')
            .then(jsonData => {
                setOperations(jsonData.map(item => new Operation(item.Id, item.Cod_IOE, item.Nombre, item.Codigo, item.Url)));
                setLoading(false);
            })
            .catch(error => {
                setError(error);
                setLoading(false);
                console.error("Failed to fetch operations:", error);
            });
    }, []);

    //On operations change, update the options with the new operations
    useEffect(() => {
        setOptions(operations.map(operation => ({
            value: operation.id,
            label: `${operation.nombre} -> ID: ${operation.id}`
        })))
        console.log("Available operations: ", operations); //TODO: Remove
    }, [operations]);

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onOperationSelect(selectedOption ? selectedOption.value : null);
        console.log(selectedOption);
    }

    if (loading) return (
        <>
            <p>Cargando operaciones disponibles...</p>
            <LinearProgress />
        </>
    );

    if (error) return (
        <>
            <p>Error al cargar operaciones disponibles: {error.message}</p>
        </>
    );

    return (
        <div>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                placeholder="Busca y selecciona una operación..."
                isClearable={true}
                isSearchable={true}
            />
        </div>
    );
};

export default OperationsSelector;
