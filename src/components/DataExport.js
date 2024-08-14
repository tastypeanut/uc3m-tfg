import React, {useState} from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import * as Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import {Box, Button, ButtonGroup, Link, Menu, MenuItem, Tooltip, Typography} from "@mui/material";
import {ArrowDropDown} from "@mui/icons-material";
import DownloadIcon from '@mui/icons-material/Download';
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import InfoIcon from '@mui/icons-material/Info';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';

const DataExporter = ({ normalizedData }) => {

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (exportFunc) => {
        setAnchorEl(null);
        if (exportFunc) exportFunc();
    };

    // Helper function to get the current date and time in YYYY-MM-DD_HH-MM-SS format
    const getCurrentDateTime = () => {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    };

    const exportToExcel = () => {
        const worksheetData = [];

        normalizedData.forEach((item) => {
            item.data.forEach((dataPoint) => {
                worksheetData.push({
                    cod: item.cod,
                    nombre: item.nombre,
                    fkUnidad: item.fkUnidad,
                    fkEscala: item.fkEscala,
                    fecha: new Date(dataPoint.fecha).toLocaleDateString(), // Convert timestamp to readable date
                    fkTipoDato: dataPoint.fkTipoDato,
                    fkPeriodo: dataPoint.fkPeriodo,
                    anyo: dataPoint.anyo,
                    valor: dataPoint.valor,
                    secreto: dataPoint.secreto,
                });
            });
        });

        const worksheet = XLSX.utils.json_to_sheet(worksheetData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });

        const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
        saveAs(blob, `exportado_${getCurrentDateTime()}.xlsx`);
    };

    const exportToCSV = () => {
        const csvData = [];

        normalizedData.forEach((item) => {
            item.data.forEach((dataPoint) => {
                csvData.push({
                    cod: item.cod,
                    nombre: item.nombre,
                    fkUnidad: item.fkUnidad,
                    fkEscala: item.fkEscala,
                    fecha: new Date(dataPoint.fecha).toLocaleDateString(), // Convert timestamp to readable date
                    fkTipoDato: dataPoint.fkTipoDato,
                    fkPeriodo: dataPoint.fkPeriodo,
                    anyo: dataPoint.anyo,
                    valor: dataPoint.valor,
                    secreto: dataPoint.secreto,
                });
            });
        });

        const csv = Papa.unparse(csvData);
        const bom = '\uFEFF'; // UTF-8 BOM
        const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, `data_${getCurrentDateTime()}.csv`);
    };


    const exportToPDF = () => {
        const pdf = new jsPDF();
        const pdfData = [];

        normalizedData.forEach((item) => {
            item.data.forEach((dataPoint) => {
                pdfData.push([
                    item.cod,
                    item.nombre,
                    item.fkUnidad,
                    item.fkEscala,
                    new Date(dataPoint.fecha).toLocaleDateString(), // Convert timestamp to readable date
                    dataPoint.fkTipoDato,
                    dataPoint.fkPeriodo,
                    dataPoint.anyo,
                    dataPoint.valor,
                    dataPoint.secreto,
                ]);
            });
        });

        pdf.autoTable({
            head: [['cod', 'nombre', 'fkUnidad', 'fkEscala', 'fecha', 'fkTipoDato', 'fkPeriodo', 'anyo', 'valor', 'secreto']],
            body: pdfData,
        });

        pdf.save(`exportado_${getCurrentDateTime()}.pdf`);
    };

    return (
        <>
            <Box display="flex" alignItems="center">
                <Button
                    variant="contained"
                    onClick={handleClick}
                    startIcon={<SystemUpdateAltIcon/>} //TODO: Maybe change this icon
                    endIcon={<ArrowDropDown/>}
                >
                    Exportar Datos
                </Button>
                <Tooltip
                    title={
                    <>
                            Al exportar, se incluyen todos los campos devueltos por la base de datos del INE. Puedes consultar la documentación oficial en {' '}
                            <Link
                                href="https://ine.es/dyngs/DataLab/manual.html?cid=64"
                                target="_blank"
                                rel="noopener"
                                sx={{ color: 'inherit', textDecoration: 'underline', whiteSpace: 'nowrap', cursor: 'pointer' }}
                            >
                                https://ine.es/dyngs/DataLab/manual.html?cid=64
                            </Link>.

                    </>
                    }
                    placement="right"
                >
                    <InfoIcon style={{ cursor: 'pointer', marginLeft: 8 }} />
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => handleClose(null)}
            >
                <MenuItem onClick={() => handleClose(exportToExcel)}>Exportar a Excel</MenuItem>
                <MenuItem onClick={() => handleClose(exportToCSV)}>Exportar a CSV</MenuItem>
                <MenuItem onClick={() => handleClose(exportToPDF)}>Exportar a PDF</MenuItem>
            </Menu>
        </>
    );
};

export default DataExporter;
