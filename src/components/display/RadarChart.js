import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const RadarChart = ({ normalizedData }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous content

        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        const radius = Math.min(width, height) / 2;

        const angleSlice = (Math.PI * 2) / normalizedData.length;

        const rScale = d3.scaleLinear()
            .domain([0, d3.max(normalizedData.flatMap(d => d.data), d => d.valor)])
            .range([0, radius]);

        const radarLine = d3.lineRadial()
            .radius(d => rScale(d.valor))
            .angle((d, i) => i * angleSlice);

        svg.append("g")
            .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`)
            .selectAll(".gridCircle")
            .data(d3.range(1, 5).reverse())
            .enter().append("circle")
            .attr("r", d => (radius / 4) * d)
            .style("fill", "#CDCDCD")
            .style("stroke", "#CDCDCD")
            .style("fill-opacity", 0.1);

        svg.append("g")
            .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`)
            .selectAll(".axis")
            .data(normalizedData)
            .enter().append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", (d, i) => rScale(d3.max(d.data, e => e.valor)) * Math.cos(angleSlice * i - Math.PI / 2))
            .attr("y2", (d, i) => rScale(d3.max(d.data, e => e.valor)) * Math.sin(angleSlice * i - Math.PI / 2))
            .style("stroke", "white")
            .style("stroke-width", "2px");

        svg.append("g")
            .attr("transform", `translate(${width / 2 + margin.left},${height / 2 + margin.top})`)
            .selectAll(".radarArea")
            .data(normalizedData)
            .enter().append("path")
            .attr("d", d => radarLine(d.data))
            .style("fill", "blue")
            .style("fill-opacity", 0.3)
            .style("stroke", "blue")
            .style("stroke-width", "2px");

    }, [normalizedData]);

    return <svg ref={ref} width={600} height={600}></svg>;
};

export default RadarChart;
