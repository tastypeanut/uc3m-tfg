import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ data }) => {
    const svgRef = useRef();
    const [tooltip, setTooltip] = useState({ visible: false, data: null, x: 0, y: 0 });

    useEffect(() => {
        if (!data || data.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svgElement = d3.select(svgRef.current);
        svgElement.selectAll("*").remove(); // Clear the SVG to avoid duplicates

        const svg = svgElement
            .attr("width", "100%")
            .attr("height", "100%")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);


        const xScale = d3.scaleTime()
            .domain(d3.extent(data.flatMap(series => series.data), d => new Date(d.fecha)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data.flatMap(series => series.data), d => d.valor)])
            .range([height, 0]);

        const lineGenerator = d3.line()
            .x(d => xScale(new Date(d.fecha)))
            .y(d => yScale(d.valor))
            .curve(d3.curveMonotoneX);

        // Create and update the lines
        svg.selectAll(".line")
            .data(data)
            .join("path")
            .attr("class", "line on-hover-highlight")
            .attr("fill", "none")
            .attr("stroke", d => d.color || "steelblue") // Assume each data series can have a color
            .attr("stroke-width", 1.5)
            .attr("d", d => lineGenerator(d.data));


        // Create and update the circles for each point
        data.forEach((series, idx) => {
            svg.selectAll(`.dot-series-${idx}`)
                .data(series.data)  // Bind the data points from the series
                .join("circle")
                .attr("class", `dot dot-series-${idx} on-hover-highlight`)
                .attr("cx", d => xScale(new Date(d.fecha)))
                .attr("cy", d => yScale(d.valor))
                .attr("r", 3)
                .attr("fill", series.color || "steelblue")
                .on("mouseover", (event, d) => {
                    // Include the series nombre when setting the tooltip state
                    setTooltip({ visible: true, data: { ...d, nombre: series.nombre }, x: event.pageX, y: event.pageY });
                })
                .on("mousemove", (event, d) => {
                    setTooltip({ visible: true, data: { ...d, nombre: series.nombre }, x: event.pageX, y: event.pageY });
                })
                .on("mouseout", () => {
                    setTooltip({ visible: false, data: null });
                });
        });


        // Add axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));

    }, [data]); // Dependency array to update on data change

    return (
        <div>
            <svg ref={svgRef}></svg>
            {tooltip.visible && (
                <div style={{ position: "absolute", left: tooltip.x + 10, top: tooltip.y + 10, backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', pointerEvents: 'none' }}>
                    Valor:  {tooltip.data.valor}<br/>
                    Fecha:  {new Date(tooltip.data.fecha).toLocaleDateString()}<br/>
                    Serie:  {tooltip.data.nombre}<br/>
                </div>
            )}
        </div>
    );
};

export default LineGraph;
