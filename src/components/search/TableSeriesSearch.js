import React, { useState, useEffect } from 'react';
import { fetchData } from '../../services/ineApi';
import { TableGroup, TableGroupValue } from "../../classes/TableGroup";
import Select from "react-select";
import {SeriesInfo} from "../../classes/SeriesInfo";

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

    useEffect(() => {
        console.log("Selected values:", selectedValues);
        generateTableQueryString();
    }, [selectedValues]); //TODO: Delete this effect

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
        console.log(searchString);
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
                console.log("Search results:", jsonData);
            })
            .catch(error => {
                console.error("Failed to fetch search results:", error);
            })
            .finally(() => {
                onSeriesSelect(resultingSeries);
            });
    };

    if (loading) return <p>Loading tables...</p>;
    if (error) return <p>Error fetching tables: {error.message}</p>;

    return (
        <form>
            {tableGroups.map(group => (
                <div key={group.id}>
                    <h2>{group.nombre}</h2>
                    <div>
                        <button type="button" onClick={() => handleSelectAll(group)}>Select All</button>
                        <button type="button" onClick={() => handleDeselectAll(group)}>Deselect All</button>
                    </div>
                    <Select
                        isMulti
                        //key={group.id} //Unique key is necessary, this is why this is commented
                        value={selectedValues[group.id]}
                        onChange={(option) => handleSelectChange(option, group)}
                        options={group.options}
                        placeholder="Search and select a variable..."
                        isClearable={true}
                        isSearchable={true}
                    />
                </div>
            ))}
            <div>
                <button type="button" onClick={() => handleSeriesSearch()}>Search...</button>
            </div>
        </form>
    );
};

export default TableSeriesSearch;