import React, { useState, useEffect, useCallback } from 'react';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { fetchData } from '../../services/ineApi';
import { TableInfo } from "../../classes/info/TableInfo";
import {FormControlLabel, LinearProgress, Paper} from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";

// Custom hook for fetching and loading data
const useFetchData = (type, itemId) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData(type, itemId, {});
                setData(result);
            } catch (error) {
                console.error(`Failed to fetch ${type}:`, error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchDataAsync();
    }, [type, itemId]);

    return { data, loading, error };
};

// Custom hook for lazy loading tree items
const useLazyLoad = (itemId) => {
    const [children, setChildren] = useState([]);
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadChildren = async () => {
            if (children.length === 0 && tables.length === 0) {
                setLoading(true);
                try {
                    const childData = await fetchData('CAPITULOS', itemId, {});
                    if (childData.length > 0) {
                        setChildren(childData);
                    } else {
                        const tableData = await fetchData('TABLAS_CAPITULO', itemId, {});
                        const tableInfos = tableData.map(table => TableInfo.fromJson(table));
                        setTables(tableInfos);
                    }
                } catch (error) {
                    console.error("Failed to load data:", error);
                    setError(error);
                } finally {
                    setLoading(false);
                }
            }
        };

        loadChildren();
    }, [itemId]);

    return { children, tables, loading, error };
};

// Component to render tree items lazily
const LazyTreeItem = React.memo(({ itemId, label, selectedTable, onTableSelect }) => {
    const { children, tables, loading, error } = useLazyLoad(itemId);

    const renderTreeItems = () => {
        if (loading) return (
            <>
                <Typography variant="body1">Cargando elementos...</Typography>
                <LinearProgress />
            </>
        );

        if (error) return (
            <>
                <Typography variant="body1" color="error">Error al cargar elementos: {error.message}</Typography>
            </>
        );

        if (children.length > 0) {
            return children.map((child) => (
                <LazyTreeItem
                    key={child.Id}
                    itemId={child.Id}
                    label={child.Nombre}
                    selectedTable={selectedTable}
                    onTableSelect={onTableSelect}
                />
            ));
        }

        return tables.map((table) => (
            <TreeItem key={table.id} itemId={`table-${table.id}`} label={
                <Box display="flex" alignItems="center">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={selectedTable?.id === table.id}
                                onChange={() => onTableSelect(table)}
                            />
                        }
                        label={`${table.nombre} → ID: ${table.id}`}
                    />
                </Box>
            } />
        ));
    };

    return <TreeItem itemId={itemId.toString()} label={label}>{renderTreeItems()}</TreeItem>;
});

// Main component for rendering the tree with operationId parameter
const TreeTableSelector = ({ operationId, onTableSelect }) => {
    const { data: rootNodes, loading, error } = useFetchData('CAPITULOSRAIZ_OPERACION', operationId);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        onTableSelect(selectedTable);
    }, [selectedTable, onTableSelect]);

    const handleTableSelect = useCallback((table) => {
        setSelectedTable(table);
    }, []);

    if (loading) return (
        <>
            <Typography variant="body1">Cargando tablas disponibles...</Typography>
            <LinearProgress />
        </>
    );

    if (error) return (
        <>
            <Typography variant="body1" color="error">Error al cargar tablas disponibles: {error.message}</Typography>
        </>
    );

    return (
        <Paper variant="outlined">
            <Grid2 item>
                <SimpleTreeView>
                    {rootNodes.map((node) => (
                        <LazyTreeItem
                            key={node.Id}
                            itemId={node.Id}
                            label={node.Nombre}
                            selectedTable={selectedTable}
                            onTableSelect={handleTableSelect}
                        />
                    ))}
                </SimpleTreeView>
            </Grid2>
        </Paper>
    );
};

export default TreeTableSelector;
