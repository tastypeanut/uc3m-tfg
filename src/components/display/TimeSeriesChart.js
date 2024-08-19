import React, { useRef, useEffect, useState, useCallback } from "react";
import * as d3 from "d3";
import useResizeObserver from "@react-hook/resize-observer";
import {
    Accordion, AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    FormControlLabel,
    FormGroup,
    Paper,
    Typography
} from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Grid2 from "@mui/material/Unstable_Grid2";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import DownloadIcon from "@mui/icons-material/Download";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const TimeSeriesChart = ({ normalizedData }) => {
    const chartRef = useRef();
    const [containerWidth, setContainerWidth] = useState(0);
    const [showTrendLine, setShowTrendLine] = useState(false);
    const [showMovingAverage, setShowMovingAverage] = useState(false);
    const [activeDatasets, setActiveDatasets] = useState([]);

    useResizeObserver(chartRef, entry => setContainerWidth(entry.contentRect.width));

    const downloadAsSVG = () => {
        const svgElement = chartRef.current.querySelector("svg");
        const svgString = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const svgLink = document.createElement("a");
        svgLink.href = URL.createObjectURL(svgBlob);
        svgLink.download = "chart.svg";
        svgLink.click();
    };

    const parseDate = useCallback(d => {
        return d3.timeParse("%Y-%m-%d")(d) || new Date(+d);
    }, []);

    const calculateLinearTrendLine = useCallback((data) => {
        const n = data.length;
        const xSum = d3.sum(data, d => parseDate(d.fecha).getTime());
        const ySum = d3.sum(data, d => d.valor);
        const xySum = d3.sum(data, d => parseDate(d.fecha).getTime() * d.valor);
        const xSquaredSum = d3.sum(data, d => Math.pow(parseDate(d.fecha).getTime(), 2));

        const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - Math.pow(xSum, 2));
        const intercept = (ySum - slope * xSum) / n;

        return data.map(d => ({
            fecha: d.fecha,
            valor: slope * parseDate(d.fecha).getTime() + intercept,
        }));
    }, [parseDate]);

    const calculateMovingAverage = useCallback((data, windowSize) => {
        return data.map((val, idx, arr) => {
            if (idx < windowSize - 1) return null;
            const windowSlice = arr.slice(idx - windowSize + 1, idx + 1);
            const avg = d3.mean(windowSlice, d => d.valor);
            return { fecha: val.fecha, valor: avg };
        }).filter(d => d !== null);
    }, []);

    const toggleDatasetVisibility = cod => {
        setActiveDatasets(prev =>
            prev.includes(cod) ? prev.filter(d => d !== cod) : [...prev, cod]
        );
    };

    const removeAllDatasets = () => {
        setActiveDatasets([]);
    };

    const addAllDatasets = () => {
        setActiveDatasets(normalizedData.map(dataset => dataset.cod));
    };

    useEffect(() => {
        if (normalizedData && normalizedData.length > 0) {
            setActiveDatasets(normalizedData.map(dataset => dataset.cod));
        }
    }, [normalizedData]);

    useEffect(() => {
        if (!normalizedData || normalizedData.length === 0 || containerWidth === 0) return;

        const margin = { top: 20, right: 50, bottom: 50, left: 50 };
        const width = containerWidth - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .html("")
            .append("svg")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .attr("preserveAspectRatio", "xMidYMid meet")
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const filteredData = normalizedData.map(dataset => ({
            ...dataset,
            data: dataset.data.filter(point => point.valor !== null),
        })).filter(dataset => activeDatasets.includes(dataset.cod) && dataset.data.length > 0);

        if (filteredData.length === 0) {
            svg.append("text")
                .attr("x", width / 2)
                .attr("y", height / 2)
                .attr("text-anchor", "middle")
                .attr("dy", ".35em")
                .style("font-size", "16px")
                .style("fill", "#666")
                .text("No se ha seleccionado ningún dato");
            return;
        }

        const colorScale = d3.scaleOrdinal(d3.schemeCategory10)
            .domain(normalizedData.map(dataset => dataset.cod));

        const allDates = filteredData.flatMap(d =>
            d.data.map(point => parseDate(point.fecha))
        );
        const allValues = filteredData.flatMap(d => d.data.map(point => point.valor));

        const yMin = Math.min(0, d3.min(allValues));
        const yMax = d3.max(allValues);
        const xMin = d3.min(allDates);
        const xMax = d3.max(allDates);

        const xScale = d3.scaleTime().domain([xMin, xMax]).range([0, width]);
        const yScale = d3.scaleLinear().domain([yMin, yMax]).range([height, 0]);

        const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat("%d/%m/%Y"));
        const yAxis = d3.axisLeft(yScale);

        const xAxisGroup = svg.append("g")
            .attr("transform", `translate(0,${yScale(0)})`)
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "start")
            .attr("transform", "rotate(45)")
            .attr("dx", "0.8em")
            .attr("dy", "0.15em");

        const yAxisGroup = svg.append("g")
            .call(yAxis);

        const yAxisLabelWidth = yAxisGroup.node().getBBox().width;
        margin.left = Math.max(margin.left, yAxisLabelWidth + 10);
        svg.attr("transform", `translate(${margin.left},${margin.top})`);

        const xAxisLabelHeight = xAxisGroup.node().getBBox().height;
        margin.bottom = Math.max(margin.bottom, xAxisLabelHeight + 10);
        svg.attr("transform", `translate(${margin.left},${margin.top})`);

        svg.attr("transform", `translate(${margin.left},${margin.top})`);

        svg.select(".x-axis").attr("transform", `translate(0,${yScale(0)})`).call(xAxis);
        yAxisGroup.call(yAxis);

        const line = d3.line()
            .x(d => xScale(parseDate(d.fecha)))
            .y(d => yScale(d.valor))
            .curve(d3.curveMonotoneX);

        filteredData.forEach((dataset) => {
            const originalStrokeColor = showTrendLine || showMovingAverage ? "#ccc" : colorScale(dataset.cod);

            svg.append("path")
                .datum(dataset.data)
                .attr("fill", "none")
                .attr("stroke", originalStrokeColor)
                .attr("stroke-width", 1.5)
                .attr("d", line);

            const dots = svg.selectAll(`.dot-${dataset.cod}`)
                .data(dataset.data)
                .enter()
                .append("circle")
                .attr("class", `dot-${dataset.cod}`)
                .attr("cx", d => xScale(parseDate(d.fecha)))
                .attr("cy", d => yScale(d.valor))
                .attr("r", 4)
                .attr("fill", originalStrokeColor);

            const tooltip = d3.select(chartRef.current)
                .append("div")
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "white")
                .style("border", "1px solid #ccc")
                .style("padding", "5px")
                .style("border-radius", "3px")
                .style("font-size", "12px");

            dots.on("mouseover", function (event, d) {
                tooltip
                    .style("visibility", "visible")
                    .html(`Código: ${dataset.cod}<br/>Nombre: ${dataset.nombre}<br/>Fecha: ${d3.timeFormat("%d/%m/%Y")(parseDate(d.fecha))}<br/>Valor: ${d.valor}`);
                d3.select(this).attr("r", 6);
            })
                .on("mousemove", function (event) {
                    tooltip
                        .style("top", `${event.pageY - 10}px`)
                        .style("left", `${event.pageX + 10}px`);
                })
                .on("mouseout", function () {
                    tooltip.style("visibility", "hidden");
                    d3.select(this).attr("r", 4);
                });
        });

        filteredData.forEach((dataset) => {
            if (showMovingAverage) {
                const movingAverageData = calculateMovingAverage(dataset.data, 3);
                svg.append("path")
                    .datum(movingAverageData)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(dataset.cod))
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "2,2")
                    .attr("d", line);
            }
        });

        filteredData.forEach((dataset) => {
            if (showTrendLine) {
                const trendLineData = calculateLinearTrendLine(dataset.data);
                svg.append("path")
                    .datum(trendLineData)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(dataset.cod))
                    .attr("stroke-width", 1.5)
                    .attr("stroke-dasharray", "5,5")
                    .attr("d", line);
            }
        });

    }, [normalizedData, showTrendLine, showMovingAverage, calculateLinearTrendLine, calculateMovingAverage, parseDate, containerWidth, activeDatasets]);

    return (
        <Paper sx={{px: 4}}>
            <Grid2>
                <Grid2 xs={12}>
                    <Paper variant="outlined">
                        <Grid2 container ref={chartRef} sx={{m: 0, p: 2}}/>
                    </Paper>
                </Grid2>
                <Grid2 container xs={12} spacing={4}>
                    <Grid2 container xs={12} md={3} spacing={2} display="block">
                        <Grid2 xs={12} item>
                            <Typography variant="h6">Ajustes de gráfica:</Typography>
                        </Grid2>
                        <Grid2 xs={12} item>
                            <Paper variant="outlined" sx={{p: 2}}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showTrendLine}
                                                onChange={() => setShowTrendLine(!showTrendLine)}
                                                color="primary"
                                            />
                                        }
                                        label="Mostrar línea de tendencia"
                                    />
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={showMovingAverage}
                                                onChange={() => setShowMovingAverage(!showMovingAverage)}
                                                color="primary"
                                            />
                                        }
                                        label="Mostrar media móvil (n=3)"
                                    />
                            </Paper>
                        </Grid2>
                        <Grid2 xs={12} item display="flex" justifyContent="center" alignItems="center">
                            <Button variant="outlined" size="small" startIcon={<DownloadIcon/>} onClick={downloadAsSVG}>Descargar SVG</Button>
                        </Grid2>
                    </Grid2>
                    <Grid2 container xs={12} md={9} spacing={2}>
                        <Grid2 item xs={12}>
                            <Typography variant="h6">Series mostradas:</Typography>
                        </Grid2>
                        <Grid2 item xs={12}>
                            <Paper variant="outlined" sx={{px: 2}}>
                                <Grid2
                                    xs={12}
                                    display="grid"
                                    sx={{
                                        maxHeight: '500px', // Set your desired max height here
                                        overflowY: 'auto',  // Enable vertical scrolling
                                    }}
                                >
                                    {normalizedData.map((dataset) => (
                                        <FormControlLabel
                                            key={dataset.cod}
                                            control={
                                                <Checkbox
                                                    checked={activeDatasets.includes(dataset.cod)}
                                                    onChange={() => toggleDatasetVisibility(dataset.cod)}
                                                />
                                            }
                                            label={
                                                <Typography
                                                    sx={{
                                                        color: activeDatasets.includes(dataset.cod)
                                                            ? d3.schemeCategory10[normalizedData.findIndex(d => d.cod === dataset.cod) % 10]
                                                            : "#ccc",
                                                    }}
                                                >
                                                    {dataset.nombre}
                                                </Typography>
                                            }
                                        />
                                    ))}
                                </Grid2>
                            </Paper>
                        </Grid2>
                        <Grid2 container xs={12} spacing={4} display="flex" justifyContent="center" alignItems="center">
                            <Grid2 item>
                                <Button variant="contained" size="small" startIcon={<AddCircleOutlineIcon/>} onClick={addAllDatasets}>Seleccionar todo</Button>
                            </Grid2>
                            <Grid2 item>
                                <Button variant="contained" size="small" startIcon={<RemoveCircleOutlineIcon/>} onClick={removeAllDatasets}>Borrar Selección</Button>
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Grid2>
            </Grid2>
        </Paper>
    );
};

export default TimeSeriesChart;
