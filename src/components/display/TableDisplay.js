import React from 'react';
import {
    DataGrid,
    GridToolbar,
    GRID_STRING_COL_DEF,
} from '@mui/x-data-grid';
import { esES } from "@mui/x-data-grid/locales";
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { Box } from "@mui/material";
import { useData } from './TableAux/UseData.js'; // Import the updated hook



export default function TableDisplay({ flatData }) {
    const { columns, rows } = useData(flatData);

    return (
        <Box
            sx={{
                width: '100%',
                margin: '0',
                '& .table-display-header ': {
                    backgroundColor: 'white',
                },
                '& .MuiDataGrid-columnHeaderCheckbox': {
                    backgroundColor: 'white',
                },
            }}
        >
            <DataGrid
                autoHeight
                columns={columns}
                rows={rows}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    }
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
                checkboxSelection
                onRowSelectionModelChange={(ids) => {
                    const selectedIDs = new Set(ids);
                    const selectedRowData = rows.filter((row) =>
                        selectedIDs.has(row.id.toString())
                    );
                    console.log("Selected Row Data: ", selectedRowData);
                }}
                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
            />
        </Box>
    );
}
