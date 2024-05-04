import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/ineApi';
import {Table} from "../../classes/Table";
import {LinearProgress} from "@mui/material";

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
                    setTables(jsonData.map(item => new Table(item.Id, item.Nombre, item.Codigo, item.FK_Periodicidad, item.FK_Publicacion, item.FK_Periodo_ini, item.Anyo_Periodo_ini, item.FechaRef_fin, item.Ultima_Modificacion)));
                    setLoading(false);
                })
                .catch(error => {
                    setError(error);
                    setLoading(false);
                    console.error("Failed to fetch tables:", error);
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
            <p>Cargando tablas disponibles...</p>
            <LinearProgress/>
        </>
    );

    if (error) return (
        <>
            <p>Error al cargar tablas disponibles: {error.message}</p>
        </>
    );

    return (
        <div>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                placeholder="Busca y selecciona una tabla..."
                isClearable={true}
                isSearchable={true}
            />
        </div>
    );
};

export default TablesSelector;
