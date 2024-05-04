import React, {useEffect, useState} from "react";
import {fetchSeriesData} from "../services/seriesDataFetch";
import OperationsSelector from "./select/OperationsSelector";
import TablesSelector from "./select/TablesSelector";
import TableSeriesSearch from "./search/TableSeriesSearch";
import Grid2 from "@mui/material/Unstable_Grid2";


const DataLookup = ({ onDataLookup }) => {

    const [selectedOperation, setSelectedOperation] = useState(null);
    const [selectedTable, setSelectedTable] = useState(null);
    const [selectedSeries, setSelectedSeries] = useState({});

    //const [retrievedData, setRetrievedData] = useState([]);

    useEffect(() => {
        setSelectedTable(null);
        setSelectedSeries([]);
        onDataLookup([]);
        //setRetrievedData([]);
    }, [selectedOperation]);

    useEffect(() => {
        setSelectedSeries([]);
        onDataLookup([]);
        //setRetrievedData([]);
    }, [selectedTable]);

    //Fetch data for the selected series
    useEffect(() => {
        console.log("Selected series: ", selectedSeries);
        if (Object.keys(selectedSeries).length !== 0) {
            fetchSeriesData(selectedSeries)
                .then(data =>
                    console.log("Data fetched: ", data) ||
                    //setRetrievedData(data))
                    onDataLookup(data))
                .catch(error => console.error("Error fetching series data:", error));
        }
    }, [selectedSeries]);


    return (
        <Grid2 container spacing={2}>
            <Grid2 xs={12}>
                <h2>Selecciona una operación:</h2>
                <OperationsSelector onOperationSelect={setSelectedOperation}/>
            </Grid2>
            {selectedOperation &&
                <Grid2 xs={12}>
                    <h2>Selecciona una tabla:</h2>
                    <TablesSelector operationId={selectedOperation} onTableSelect={setSelectedTable}/>
                </Grid2>
            }
            {selectedTable &&
                <Grid2 xs={12}>
                    <h2>Selecciona las variables relevantes de la tabla:</h2>
                    <TableSeriesSearch tableId={selectedTable} onSeriesSelect={setSelectedSeries}/>
                </Grid2>
            }
        </Grid2>
    );
}

export default DataLookup;