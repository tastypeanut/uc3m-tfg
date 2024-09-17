import React, { useState, useMemo, useEffect } from 'react';
import {parseDataDate, processData} from './DataUtils';
import {GRID_STRING_COL_DEF} from "@mui/x-data-grid";
import {SparkLineChart} from "@mui/x-charts/SparkLineChart"; // Import the utility function

export function useData(flatData) {
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);

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

    useEffect(() => {
        const { seriesInfo: seriesInfo, seriesData: seriesData, dateArray: dateArray} = processData(flatData);

        const newRows = [];

        seriesInfo.forEach((info, index) => {
            seriesInfo[index].sparkline = Object.keys(seriesData[index])
                .sort((a, b) => new Date(a) - new Date(b)) // Sort keys (dates)
                .map(key => seriesData[index][key]); // Access seriesData at the current index

            newRows.push({ ...seriesInfo[index], ...seriesData[index] });
        });

        console.log("newRows: ", Array.of(seriesData[0]));

        const newColumns = [
            {
                field: 'nombreOperacion',
                headerName: 'Operación',
                flex: 1,
                minWidth: 150,
                headerClassName: 'table-display-header',
            },
            {
                field: 'nombreTabla',
                headerName: 'Tabla',
                flex: 1,
                minWidth: 150,
                headerClassName: 'table-display-header',
            },
            {
                field: 'nombreSerie',
                headerName: 'Serie',
                flex: 2,
                minWidth: 250,
                headerClassName: 'table-display-header',
            },
            {
                field: 'unidad',
                headerName: 'Unidad',
                flex: 1,
                minWidth: 100,
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
            ...dateArray.map(date => ({
                field: date,
                headerName: date,
                flex: 0.5,
                minWidth: 135,
                headerClassName: 'table-display-header',
            })),
        ];

        setRows(newRows);
        setColumns(newColumns);

    }, [flatData]);

    return { columns, rows };
}
