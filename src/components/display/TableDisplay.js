import React, { useMemo } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { unparse } from 'papaparse';


// Helper function to convert Unix timestamp to a readable date
const formatDate = (unixTimestamp) => {
    return new Date(unixTimestamp).toLocaleDateString("es-ES");
};

// Helper function to compare dates for sorting
const compareDates = (date1, date2) => {
    return new Date(date1) - new Date(date2);
};

const DataTable = ({ data }) => {
    const dates = useMemo(() => {
        const dateSet = new Set();
        data.forEach(record => {
            record.data.forEach(dp => {
                dateSet.add(formatDate(dp.fecha));
            });
        });
        return Array.from(dateSet).sort(compareDates);
    }, [data]);

    const dataMap = useMemo(() => {
        const map = new Map();
        data.forEach(record => {
            let innerMap = map.get(record.nombre) || new Map();
            record.data.forEach(dp => {
                innerMap.set(formatDate(dp.fecha), dp.valor);
            });
            map.set(record.nombre, innerMap);
        });
        return map;
    }, [data]);

    const renderTableHeader = useMemo(() => (
        <>
            <TableRow>
                <TableCell>Nombre</TableCell>
                {dates.map(date => (
                    <TableCell key={date}>{date}</TableCell>
                ))}
            </TableRow>
        </>
    ), [dates]);

    const renderTableData = useMemo(() => (
        Array.from(dataMap, ([nombre, yearMap]) => (
            <TableRow key={nombre}>
                <TableCell>{nombre}</TableCell>
                {dates.map(date => (
                    <TableCell key={`${nombre}-${date}`}>{yearMap.get(date) || '-'}</TableCell>
                ))}
            </TableRow>
        ))
    ), [dataMap, dates]);

    // Function to export data as Excel
    const exportToExcel = () => {
        const wb = XLSX.utils.book_new();
        const wsData = [
            ["Nombre", ...dates], // Header
            ...Array.from(dataMap, ([nombre, yearMap]) => [
                nombre,
                ...dates.map(date => yearMap.get(date) || '-')
            ])
        ];
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        XLSX.utils.book_append_sheet(wb, ws, "Data");
        XLSX.writeFile(wb, "table_data.xlsx");
    };

    // Function to export data as CSV using papaparse
    const exportToCSV = () => {
        const csvData = Array.from(dataMap, ([nombre, yearMap]) => ({
            Nombre: nombre,
            ...Object.fromEntries(dates.map(date => [date, yearMap.get(date) || '-']))
        }));
        const csv = unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, "table_data.csv");
    };

    // Function to export data as PDF
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Table Data", 14, 16);
        const tableData = Array.from(dataMap, ([nombre, yearMap]) => [
            nombre,
            ...dates.map(date => yearMap.get(date) || '-')
        ]);
        doc.autoTable({
            head: [["Nombre", ...dates]],
            body: tableData
        });
        doc.save("table_data.pdf");
    };

    return (
        <>
            <Button variant="contained" color="success" onClick={exportToExcel}>Exportar a Excel</Button>
            <Button variant="contained" color="success" onClick={exportToCSV}>Exportar a CSV</Button>
            <Button variant="contained" color="success" onClick={exportToPDF}>Exportar a PDF</Button>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        {renderTableHeader}
                    </TableHead>
                    <TableBody>
                        {renderTableData}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
};

export default DataTable;
