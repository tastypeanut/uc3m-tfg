import React, { useMemo, useCallback } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

// Helper function to compare dates for sorting
const compareDates = (date1, date2) => {
    return date1 - date2;
};

const DataTable = ({ normalizedData }) => {

    const parseDataDate = useCallback(data => {
        const year = data.anyo;
        const month = parseInt(data.periodo.mesInicio, 10);
        const day = parseInt(data.periodo.diaInicio, 10);
        // Subtract 1 from month because JavaScript months are zero-indexed
        return new Date(year, month - 1, day);
    }, []);

    const dates = useMemo(() => {
        const dateSet = new Set();
        normalizedData.forEach(record => {
            record.data.forEach(dp => {
                dateSet.add(parseDataDate(dp).toLocaleDateString("es-ES"));
            });
        });
        return Array.from(dateSet).sort((a, b) => compareDates(new Date(a), new Date(b)));
    }, [normalizedData, parseDataDate]);

    const dataMap = useMemo(() => {
        const map = new Map();
        normalizedData.forEach(record => {
            let innerMap = map.get(record.nombre) || new Map();
            record.data.forEach(dp => {
                innerMap.set(parseDataDate(dp).toLocaleDateString("es-ES"), dp.valor);
            });
            map.set(record.nombre, innerMap);
        });
        return map;
    }, [normalizedData, parseDataDate]);

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
                    <TableCell key={`${nombre}-${date}`}>{yearMap.get(date)}</TableCell>
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
