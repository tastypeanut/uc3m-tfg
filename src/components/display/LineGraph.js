import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const LineGraph = ({ records }) => {
    const svgRef = useRef();

    useEffect(() => {
        if (!records || records.length === 0) return;

        const margin = { top: 20, right: 30, bottom: 30, left: 60 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const xScale = d3.scaleTime()
            .domain(d3.extent(records.flatMap(r => r.data), d => new Date(d.fecha)))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(records.flatMap(r => r.data), d => d.valor)])
            .range([height, 0]);

        const lineGenerator = d3.line()
            .x(d => xScale(new Date(d.fecha)))
            .y(d => yScale(d.valor))
            .curve(d3.curveBasis); // This makes the line smooth

        svg.selectAll(".line")
            .data(records)
            .enter()
            .append("path")
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d => lineGenerator(d.data));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale));

        svg.append("g")
            .call(d3.axisLeft(yScale));
    }, [records]);

    return <svg ref={svgRef}></svg>;
};

export default LineGraph;
