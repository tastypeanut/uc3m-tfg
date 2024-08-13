import React, { useMemo } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// Helper function to convert Unix timestamp to a readable date
const formatDate = (unixTimestamp) => {
    return new Date(unixTimestamp).toLocaleDateString("es-ES");
};

// Helper function to compare dates for sorting
const compareDates = (date1, date2) => {
    return new Date(date1) - new Date(date2);
};

const DataTable = ({ normalizedData }) => {
    const dates = useMemo(() => {
        const dateSet = new Set();
        normalizedData.forEach(record => {
            record.data.forEach(dp => {
                dateSet.add(formatDate(dp.fecha));
            });
        });
        return Array.from(dateSet).sort(compareDates);
    }, [normalizedData]);

    const dataMap = useMemo(() => {
        const map = new Map();
        normalizedData.forEach(record => {
            let innerMap = map.get(record.nombre) || new Map();
            record.data.forEach(dp => {
                innerMap.set(formatDate(dp.fecha), dp.valor);
            });
            map.set(record.nombre, innerMap);
        });
        return map;
    }, [normalizedData]);

    const renderTableHeader = useMemo(() => (
        <>
            <TableRow>
                <TableCell rowSpan={2}>Nombre de Serie &darr;</TableCell>
                <TableCell colSpan={dates.length} align="center">Fecha</TableCell>
            </TableRow>
            <TableRow>
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

    return (
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
    );
};

export default DataTable;
