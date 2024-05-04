import React, { useMemo } from 'react';
import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

// Helper function to convert Unix timestamp to a readable date
const formatDate = (unixTimestamp) => {
    return new Date(unixTimestamp).toLocaleDateString("es-ES");
};

const DataTable = ({ data }) => {

    //Create a set of dates from the data
    const dates = useMemo(() => {
        const dateSet = new Set();
        data.forEach(record => {
            record.data.forEach(dp => {
                dateSet.add(formatDate(dp.fecha));
                console.log(formatDate(dp.fecha));
            });
        });
        return Array.from(dateSet).sort(); //TODO: Table values are not being sorted correctly Example: 1/1/2012 1/1/2013 1/10/2002	1/10/2003
    }, [data]);

    //Map data to the set of dates, so we can render it easily
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

    const renderTableHeader = () => (
        <TableRow>
            <TableCell>Nombre</TableCell>
            {dates.map(date => (
                <TableCell key={date}>{date}</TableCell>
            ))}
        </TableRow>
    );

    const renderTableData = () => (
        Array.from(dataMap, ([nombre, yearMap]) => (
            <TableRow key={nombre}>
                <TableCell>{nombre}</TableCell>
                {dates.map(date => (
                    <TableCell key={`${nombre}-${date}`}>{yearMap.get(date) || '-'}</TableCell>
                ))}
            </TableRow>
        ))
    );

    return (
        <Grid2 container xs={10}>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        {renderTableHeader()}
                    </TableHead>
                    <TableBody>
                        {renderTableData()}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid2>
    );
};

export default DataTable;
