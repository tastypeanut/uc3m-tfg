import {useEffect, useState} from "react";
import {fetchSeriesData} from "../services/seriesDataFetch";
import OperationsSelector from "./select/OperationsSelector";
import TablesSelector from "./select/TablesSelector";
import TableSeriesSearch from "./search/TableSeriesSearch";
import TableDisplay from "./display/TableDisplay";
import Delete_TableDataSelector from "./select/Delete_TableDataSelector";

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
        <div className="App">
            <h1>INE Data Viewer</h1>

            { /* Select an operation */ }
            <OperationsSelector onOperationSelect={setSelectedOperation} />

            { /* Select a table */ }
            {selectedOperation &&
                <TablesSelector operationId={selectedOperation} onTableSelect={setSelectedTable} />
            }

            { /* Search and select relevant series in that table */ }
            {selectedTable &&
                <TableSeriesSearch tableId={selectedTable} onSeriesSelect={setSelectedSeries} />
            }

        </div>
    );
}

export default DataLookup;