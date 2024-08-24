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
import {
    calculateBollingerBands,
    calculateExponentialMovingAverage,
    calculateLinearTrendLine,
    calculateMovingAverage, calculateWeightedMovingAverage, detectPeaks
} from "./GraphicalStatisticalFunctions";
import {
    calculateCumulativeSum,
    calculateExponentialSmoothing,
    calculateStandardDeviation
} from "./NumericalStatisticalCalculations";

const TimeSeriesChart = ({ normalizedData }) => {
    const chartRef = useRef();
    const [containerWidth, setContainerWidth] = useState(0);
    const [showTrendLine, setShowTrendLine] = useState(false);
    const [showMovingAverage, setShowMovingAverage] = useState(false);
    const [activeDatasets, setActiveDatasets] = useState([]);

    const [showEMA, setShowEMA] = useState(false);
    const [showWMA, setShowWMA] = useState(false);
    const [showStdDev, setShowStdDev] = useState(false);
    const [showBollingerBands, setShowBollingerBands] = useState(false);
    const [showAutocorrelation, setShowAutocorrelation] = useState(false);
    const [showCUSUM, setShowCUSUM] = useState(false);
    const [showExponentialSmoothing, setShowExponentialSmoothing] = useState(false);
    const [showCrossCorrelation, setShowCrossCorrelation] = useState(false);
    const [showPeaks, setShowPeaks] = useState(false);

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

    const parseDataDate = useCallback(data => {
        const year = data.anyo;
        const month = parseInt(data.periodo.mesInicio, 10);
        const day = parseInt(data.periodo.diaInicio, 10);
        // Subtract 1 from month because JavaScript months are zero-indexed
        return new Date(year, month - 1, day);
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
            d.data.map(point => parseDataDate(point))
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
            .x(d => xScale(parseDataDate(d)))
            .y(d => yScale(d.valor))
            .curve(d3.curveMonotoneX);

        filteredData.forEach((dataset) => {
            const originalStrokeColor = showTrendLine || showMovingAverage ||  showEMA || showWMA ? "#ccc" : colorScale(dataset.cod);

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
                .attr("cx", d => xScale(parseDataDate(d)))
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
                    .html(`Código: ${dataset.cod}<br/>Nombre: ${dataset.nombre}<br/>Fecha: ${d3.timeFormat("%d/%m/%Y")(parseDataDate(d))}<br/>Valor: ${d.valor}<br/>Unidad: ${dataset.unidad.nombre}`);
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

        // Añadir línea de tendencia si está habilitada
        if (showTrendLine) {
            filteredData.forEach((dataset) => {
                const trendData = calculateLinearTrendLine(dataset.data);
                svg.append("path")
                    .datum(trendData)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(dataset.cod))
                    .attr("stroke-width", 1.5)
                    .attr("stroke-dasharray", "5,5")
                    .attr("d", line);
            });
        }

        // Añadir media móvil si está habilitada
        if (showMovingAverage) {
            filteredData.forEach((dataset) => {
                const movingAverageData = calculateMovingAverage(dataset.data, 3);
                svg.append("path")
                    .datum(movingAverageData)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(dataset.cod))
                    .attr("stroke-width", 2)
                    .attr("stroke-dasharray", "2,2")
                    .attr("d", line);
            });
        }

        /*
        // Añadir Exponential Moving Average (EMA) si está habilitada
        if (showEMA) {
            filteredData.forEach((dataset) => {
                const emaData = calculateExponentialMovingAverage(dataset.data, 3); // Cambia 3 por el valor de "n" que necesites
                svg.append("path")
                    .datum(emaData)
                    .attr("fill", "none")
                    .attr("stroke", colorScale(dataset.cod))
                    .attr("stroke-width", 2)
                    .attr("d", line);
            });
        }

        // Añadir Bandas de Bollinger si está habilitada
        if (showBollingerBands) {
            filteredData.forEach((dataset) => {
                const bollingerData = calculateBollingerBands(dataset.data, 20); // Cambia 20 por el valor de "n" que necesites

                // Dibujar la media móvil (que es parte de las Bandas de Bollinger)
                const movingAverageData = bollingerData.map(d => ({...d, valor: d.valor}));
                svg.append("path")
                    .datum(movingAverageData)
                    .attr("fill", "none")
                    .attr("stroke", "blue")
                    .attr("stroke-width", 2)
                    .attr("d", line);

                // Dibujar la banda superior
                const upperBandData = bollingerData.map(d => ({...d, valor: d.upperBand}));
                svg.append("path")
                    .datum(upperBandData)
                    .attr("fill", "none")
                    .attr("stroke", "green")
                    .attr("stroke-dasharray", "5,5")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);

                // Dibujar la banda inferior
                const lowerBandData = bollingerData.map(d => ({...d, valor: d.lowerBand}));
                svg.append("path")
                    .datum(lowerBandData)
                    .attr("fill", "none")
                    .attr("stroke", "red")
                    .attr("stroke-dasharray", "5,5")
                    .attr("stroke-width", 1.5)
                    .attr("d", line);
            });
        }

        // Añadir Desviación Estándar si está habilitada
        if (showStdDev) {
            filteredData.forEach((dataset) => {
                const stdDev = calculateStandardDeviation(dataset.data);
                const mean = d3.mean(dataset.data, d => d.valor);

                // Representar la desviación estándar como una región sombreada
                svg.append("rect")
                    .attr("x", 0)
                    .attr("y", yScale(mean + stdDev))
                    .attr("width", width)
                    .attr("height", yScale(mean - stdDev) - yScale(mean + stdDev))
                    .attr("fill", "lightgrey")
                    .attr("opacity", 0.5);

                // Opcional: dibujar líneas para la media más/menos desviación estándar
                svg.append("line")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", yScale(mean + stdDev))
                    .attr("y2", yScale(mean + stdDev))
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "3,3");

                svg.append("line")
                    .attr("x1", 0)
                    .attr("x2", width)
                    .attr("y1", yScale(mean - stdDev))
                    .attr("y2", yScale(mean - stdDev))
                    .attr("stroke", "grey")
                    .attr("stroke-width", 1)
                    .attr("stroke-dasharray", "3,3");
            });
        }

        // Añadir Suma Acumulativa (CUSUM) si está habilitada
        if (showCUSUM) {
            filteredData.forEach((dataset) => {
                const cusumData = calculateCumulativeSum(dataset.data);
                svg.append("path")
                    .datum(cusumData)
                    .attr("fill", "none")
                    .attr("stroke", "purple")
                    .attr("stroke-width", 2)
                    .attr("d", line);
            });
        }

        // Añadir Suavizado Exponencial si está habilitado
        if (showExponentialSmoothing) {
            filteredData.forEach((dataset) => {
                const exponentialSmoothingData = calculateExponentialSmoothing(dataset.data, 0.3); // Cambia 0.3 por el valor de alpha que necesites
                svg.append("path")
                    .datum(exponentialSmoothingData)
                    .attr("fill", "none")
                    .attr("stroke", "brown")
                    .attr("stroke-width", 2)
                    .attr("d", line);
            });
        }

        // Añadir Picos (Peaks) si está habilitada
        if (showPeaks) {
            filteredData.forEach((dataset) => {
                // Asumiendo que tienes una función detectPeaks implementada
                const peaksData = detectPeaks(dataset.data);

                svg.selectAll(`.peak-dot-${dataset.cod}`)
                    .data(peaksData)
                    .enter()
                    .append("circle")
                    .attr("class", `peak-dot-${dataset.cod}`)
                    .attr("cx", d => xScale(parseDataDate(d)))
                    .attr("cy", d => yScale(d.valor))
                    .attr("r", 5)
                    .attr("fill", "red")
                    .attr("stroke", "black")
                    .attr("stroke-width", 1.5);
            });
        }
         */
    }, [normalizedData, showTrendLine, showMovingAverage, calculateLinearTrendLine, calculateMovingAverage, showEMA, showWMA, showStdDev, showBollingerBands, showCUSUM, showExponentialSmoothing, showCrossCorrelation, showPeaks, parseDataDate, containerWidth, activeDatasets]);

    return (
        <Paper sx={{px: 4}}>
            <Grid2>
                <Grid2 xs={12}>
                    <Paper variant="outlined">
                        <Grid2 ref={chartRef} sx={{m: 0, p: 2}}/>
                    </Paper>
                </Grid2>
                <Grid2 container xs={12} spacing={4}>
                    <Grid2 container xs={12} md={3} display="block">
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
                {/*<Grid2 container xs={12} spacing={4}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showEMA}
                                    onChange={() => setShowEMA(!showEMA)}
                                    color="primary"
                                />
                            }
                            label="Mostrar EMA (Exponential Moving Average)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showWMA}
                                    onChange={() => setShowWMA(!showWMA)}
                                    color="primary"
                                />
                            }
                            label="Mostrar WMA (Weighted Moving Average)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showStdDev}
                                    onChange={() => setShowStdDev(!showStdDev)}
                                    color="primary"
                                />
                            }
                            label="Mostrar Desviación Estándar (Volatilidad)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showBollingerBands}
                                    onChange={() => setShowBollingerBands(!showBollingerBands)}
                                    color="primary"
                                />
                            }
                            label="Mostrar Bandas de Bollinger"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showCUSUM}
                                    onChange={() => setShowCUSUM(!showCUSUM)}
                                    color="primary"
                                />
                            }
                            label="Mostrar CUSUM (Cumulative Sum)"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showExponentialSmoothing}
                                    onChange={() => setShowExponentialSmoothing(!showExponentialSmoothing)}
                                    color="primary"
                                />
                            }
                            label="Mostrar Suavizado Exponencial"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={showPeaks}
                                    onChange={() => setShowPeaks(!showPeaks)}
                                    color="primary"
                                />
                            }
                            label="Mostrar Picos"
                        />
                    </Paper>
                </Grid2>*/}
            </Grid2>
        </Paper>
    );
};

export default TimeSeriesChart;
