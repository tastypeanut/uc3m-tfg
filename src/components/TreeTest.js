import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { fetchData } from '../services/ineApi';
import { TableInfo } from "../classes/info/TableInfo";

// Custom hook for fetching and loading data
const useFetchData = (type, itemId) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDataAsync = async () => {
            try {
                const result = await fetchData(type, itemId);
                setData(result);
            } catch (error) {
                console.error(`Failed to fetch ${type}:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchDataAsync();
    }, [type, itemId]);

    return { data, loading };
};

// Custom hook for lazy loading tree items
const useLazyLoad = (itemId) => {
    const [data, setData] = useState({ children: null, tables: null });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadChildren = async () => {
            if (!data.children && !data.tables) {
                setLoading(true);
                try {
                    const children = await fetchData('CAPITULOS', itemId);
                    if (children.length > 0) {
                        setData({ children, tables: null });
                    } else {
                        const tables = await fetchData('TABLAS_CAPITULO', itemId);
                        const tableInfos = tables.map(table => TableInfo.fromJson(table));
                        setData({ children: [], tables: tableInfos });
                    }
                } catch (error) {
                    console.error("Failed to load data:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        loadChildren();
    }, [itemId]);

    return { data, loading };
};

// Component to render tree items lazily
const LazyTreeItem = ({ itemId, label, selectedTable, onTableSelect }) => {
    const { data, loading } = useLazyLoad(itemId);

    const renderTreeItems = () => {
        if (loading) {
            return <CircularProgress size={16} sx={{ marginLeft: 1 }} />;
        }

        if (data.children && data.children.length > 0) {
            return data.children.map((child) => (
                <LazyTreeItem
                    key={child.Id}
                    itemId={child.Id}
                    label={child.Nombre}
                    selectedTable={selectedTable}
                    onTableSelect={onTableSelect}
                />
            ));
        }

        return data.tables?.map((table) => (
            <TreeItem key={table.id} itemId={`table-${table.id}`} label={
                <Box display="flex" alignItems="center">
                    <Checkbox
                        checked={selectedTable?.id === table.id}
                        onChange={() => onTableSelect(table)}
                    />
                    {`${table.nombre}`}
                </Box>
            } />
        ));
    };

    return <TreeItem itemId={itemId.toString()} label={label}>{renderTreeItems()}</TreeItem>;
};

// Main component for rendering the tree with operationId parameter
const TreeTest = ({ operationId, onTableSelect }) => {
    const { data: rootNodes, loading } = useFetchData('CAPITULOSRAIZ_OPERACION', operationId);
    const [selectedTable, setSelectedTable] = useState(null);

    useEffect(() => {
        onTableSelect(selectedTable);
    }, [selectedTable]);

    const handleTableSelect = (table) => {
        setSelectedTable(table);
        onTableSelect && onTableSelect(table);
    };

    if (loading) {
        return <CircularProgress />;
    }

    return (
        <Box>
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
        </Box>
    );
};

export default TreeTest;
