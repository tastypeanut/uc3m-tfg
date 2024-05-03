import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { CSVLink } from "react-csv";
import * as XLSX from 'xlsx';
import { fetchData } from '../../services/ineApi';
import { Record, DataPoint } from '../../classes/TableData';

const TableDataSelector = ({ tableId }) => {
    const [tableData, setTableData] = useState([]);
    const [selectedTable, setSelectedTable] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (tableId) {
            setLoading(true);
            setSelectedTable(null);
            fetchData('DATOS_TABLA', tableId)
                .then(jsonData => {
                    const records = jsonData.map(item => new Record(item.COD, item.Nombre, item.FK_Unidad, item.FK_Escala, item.Data));
                    console.log(records);
                    setTableData(records);
                    setLoading(false);
                })
                .catch(error => {
                    console.error("Failed to fetch table data:", error);
                    setError(error);
                    setLoading(false);
                });
        } else {
            setTableData([]);
        }
    }, [tableId]);

    const handleSelectChange = (selectedOption) => {
        console.log(selectedOption.value);
        //setSelectedTable(selectedOption ? tableData.find(t => t.cod === selectedOption.value) : null);
    };

    const options = tableData.map(record => ({
        value: record.cod,
        label: record.nombre + " -> COD: " + record.cod
    }));

    const formatDate = (date) => new Date(date).toLocaleDateString();


    const exportToExcel = () => {
        if (selectedTable) {
            /* Convert table data to Excel format */
            const ws = XLSX.utils.json_to_sheet(selectedTable.Data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, selectedTable.Nombre.substring(0, 26));
            /* Generate a file name */
            const fileName = `${selectedTable.Nombre}.xlsx`;
            /* Trigger file download */
            XLSX.writeFile(wb, fileName);
        }
    };

    if (loading) return <p>Loading table data...</p>;
    if (error) return <p>Error fetching table data: {error.message}</p>;
    if (tableData.length === 0) return <p>No data available for this table.</p>; //TODO: Change to tableData.size??

    return (
        <div>
            <h2>Select the Table Data</h2>
            <Select
                options={options}
                onChange={handleSelectChange}
                placeholder="Select a table..."
                isClearable={true}
                isSearchable={true}
            />
        </div>
    );
};

export default TableDataSelector;
