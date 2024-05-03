import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { fetchData } from '../../services/ineApi';
import {Operation} from "../../classes/Operation";

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
        console.log("Available operations: ", operations);
    }, [operations]);

    const handleSelectChange = (selectedOption) => {
        setSelectedOption(selectedOption);
        onOperationSelect(selectedOption ? selectedOption.value : null);
        console.log(selectedOption);
    }

    if (loading) return <p>Loading operations...</p>;
    if (error) return <p>Error fetching operations: {error.message}</p>;

    return (
        <div>
            <h2>Select an Operation</h2>
            <Select
                value={selectedOption}
                onChange={handleSelectChange}
                options={options}
                placeholder="Search and select an operation..."
                isClearable={true}
                isSearchable={true}
            />
        </div>
    );
};

export default OperationsSelector;
