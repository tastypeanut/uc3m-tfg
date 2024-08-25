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

const emptyColumnType = {
    ...GRID_STRING_COL_DEF,
    type: 'custom',
    resizable: false,
    filterable: false,
    sortable: false,
    editable: false,
    groupable: false,
    columnMenuColumnsItem: null,
    disableColumnMenu: true,
};

function useData(normalizedData) {

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
                field: 'nombre',
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

        const newRows = normalizedData.map((record, index) => {
            const rowData = { id: index, nombre: record.nombre, sparkline: [] };

            record.data.forEach(dp => {
                const date = parseDataDate(dp);
                addDateColumn(date);

                if (dp.valor === null || dp.valor === undefined) {
                    rowData[date] = 'N/D';
                } else {
                    rowData[date] = dp.valor;
                    rowData.sparkline.push(dp.valor);
                }
            });

            return rowData;
        });

        setRows(newRows);

    }, [normalizedData]); // Only recalculate when normalizedData changes

    return { columns, rows };
}


export default function ColumnVirtualizationGrid({ normalizedData }) {

    const data = useData(normalizedData);

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
