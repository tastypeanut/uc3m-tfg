import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const Heatmap = ({ normalizedData }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous content

        const margin = { top: 30, right: 30, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleBand()
            .range([0, width])
            .domain(normalizedData[0].data.map(d => new Date(d.fecha).getFullYear()))
            .padding(0.01);

        const y = d3.scaleBand()
            .range([height, 0])
            .domain(normalizedData.map(d => d.nombre))
            .padding(0.01);

        const colorScale = d3.scaleSequential(d3.interpolateInferno)
            .domain([0, d3.max(normalizedData[0].data, d => d.valor)]);

        svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(${margin.left},${height + margin.top})`)
            .call(d3.axisBottom(x));

        svg.selectAll()
            .data(normalizedData[0].data)
            .enter()
            .append("rect")
            .attr("x", d => x(new Date(d.fecha).getFullYear()) + margin.left)
            .attr("y", d => y(normalizedData[0].nombre) + margin.top)
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .style("fill", d => colorScale(d.valor));
    }, [normalizedData]);

    return <svg ref={ref} width={800} height={400}></svg>;
};

export default Heatmap;
