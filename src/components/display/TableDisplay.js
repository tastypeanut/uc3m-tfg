import React, {useState, useMemo, useRef, useEffect} from 'react';
import {
    DataGrid,
    GridToolbar,
    GRID_STRING_COL_DEF,
    DEFAULT_GRID_AUTOSIZE_OPTIONS, useGridApiContext, useGridApiRef
} from '@mui/x-data-grid';
import {esES} from "@mui/x-data-grid/locales";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import {Box, Button} from "@mui/material";
import { v4 as uuidv4 } from 'uuid';

function GridSparklineCell(props) {
    if (props.value == null) {
        return null;
    }

    return (
        <SparkLineChart
            data={props.value}
            width={props.colDef.computedWidth}
            plotType={props.plotType}
        />
    );
}

const sparklineColumnType = {
    ...GRID_STRING_COL_DEF,
    type: 'custom',
    resizable: false,
    filterable: false,
    sortable: false,
    editable: false,
    groupable: false,
    display: 'flex',
    renderCell: (params) => <GridSparklineCell {...params} />,
};

function useData(flatData) {

    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const datesRef = useRef(new Set());

    const parseDataDate = (data) => {
        const year = data.anyo;
        const month = parseInt(data.periodo.mesInicio, 10) - 1; // Adjust for zero-indexed months
        const day = parseInt(data.periodo.diaInicio, 10);
        return new Date(year, month, day).toLocaleDateString("es-ES");
    };

    const addDateColumn = (date) => {
        setColumns((prevColumns) => {
            if (!datesRef.current.has(date)) {
                datesRef.current.add(date);
                const newColumns = [
                    ...prevColumns,
                    {
                        field: date,
                        headerName: date,
                        flex: 0.5,
                        minWidth: 135,
                        textAlign: 'center',
                        columnType: 'number',
                        headerClassName: 'table-display-header',
                    }
                ];

                // Sort columns: the first column is 'nombre', followed by date columns in chronological order from newest to oldest
                return newColumns.sort((a, b) => {
                    if (a.field === 'nombre') return -1;
                    if (b.field === 'nombre') return 1;
                    return new Date(b.field) - new Date(a.field); // Change sorting order: newest to oldest
                });
            }
            return prevColumns;
        });
    };

    useEffect(() => {
        // Reset datesRef and columns for a fresh calculation
        datesRef.current.clear();
        setColumns([
            {
                field: 'nombreOperacion',
                headerName: 'Nombre de Operación',
                flex: 1,
                minWidth: 150,
                headerClassName: 'table-display-header',
            },
            {
                field: 'nombreTabla',
                headerName: 'Nombre de Tabla',
                flex: 1,
                minWidth: 150,
                headerClassName: 'table-display-header',
            },
            {
                field: 'nombreSerie',
                headerName: 'Nombre de Serie',
                flex: 2,
                minWidth: 250,
                headerClassName: 'table-display-header',
            },
            {
                field: 'sparkline',
                ...sparklineColumnType,
                headerName: 'Tendencia',
                flex: 1,
                minWidth: 150,
                headerClassName: 'table-display-header',
            },
        ]);

        const newRows = [];

        const isEmptyObject = (array) => {
            // Check if the array contains a single element that is also an empty array
            return Array.isArray(array) && array.length === 1 && Array.isArray(array[0]) && array[0].length === 0;
        };

        if (isEmptyObject(flatData)) {
            setRows(newRows);
            return;
        }

        flatData.forEach((record, index) => {
            console.log("Record: ", record);

            record.seriesWithDataArray.forEach((series, index2) => {
                // Initialize rowData for this series
                const rowData = {
                    id: uuidv4(), // Unique ID for each row
                    nombreOperacion: record.operationInfo.nombre, // Operation name
                    nombreTabla: record.tableInfo.nombre, // Table name
                    nombreSerie: series.nombre, // Series name
                    sparkline: [] // Initialize sparkline array
                };

                // Process each data point in the series to populate the row
                series.data.forEach(dataPoint => {
                    const date = parseDataDate(dataPoint); // Convert dataPoint to date string
                    addDateColumn(date); // Ensure this date column exists

                    if (dataPoint.valor === null || dataPoint.valor === undefined) {
                        rowData[date] = 'N/D'; // No data available
                    } else {
                        rowData[date] = dataPoint.valor; // Assign the value to the date column
                        rowData.sparkline.push(dataPoint.valor); // Add value to sparkline
                    }
                });

                // After processing all data points for this series, push the rowData into newRows
                newRows.push(rowData);
            });
        });

        // Finally, set the rows
        setRows(newRows);

    }, [flatData]); // Only recalculate when flatData changes

    return { columns, rows };
}


export default function TableDisplay({ flatData }) {

    const data = useData(flatData);

    console.log("Data: ", data);

    return (
        <Box
            sx={{
                width: '100%',
                margin: '0',
                '& .table-display-header': {
                    backgroundColor: 'white',
                },
            }}
        >
            <DataGrid
                autoHeight
                {...data}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 20, 50, 100]}
                sx={{
                    backgroundColor: 'white',
                }}
                slots={{
                    toolbar: GridToolbar,
                }}
                slotProps={{
                    toolbar: {
                        sx: {
                            backgroundColor: 'white',
                            pt: 2,
                            px: 2,
                        },
                        showQuickFilter: true,
                        csvOptions: { disableToolbarButton: true },
                        printOptions: { disableToolbarButton: true }
                    }
                }}
                disableRowSelectionOnClick
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </Box>
    );
}
