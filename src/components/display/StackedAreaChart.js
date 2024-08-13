import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const StackedAreaChart = ({ normalizedData }) => {
    const ref = useRef();

    useEffect(() => {
        const svg = d3.select(ref.current);
        svg.selectAll("*").remove(); // Clear previous content

        const margin = { top: 20, right: 30, bottom: 30, left: 40 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        const x = d3.scaleTime()
            .domain(d3.extent(normalizedData[0].data, d => new Date(d.fecha)))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(normalizedData.flatMap(d => d.data), d => d.data.valor)])
            .nice()
            .range([height, 0]);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const area = d3.area()
            .x(d => x(new Date(d.data.fecha)))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        const stack = d3.stack()
            .keys(normalizedData.map(d => d.nombre))
            .value((d, key) => d.data.find(entry => entry.nombre === key).data.valor);

        const series = stack(normalizedData);

        svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(d3.axisLeft(y));

        svg.append("g")
            .attr("transform", `translate(${margin.left},${height + margin.top})`)
            .call(d3.axisBottom(x));

        svg.selectAll(".area")
            .data(series)
            .enter().append("path")
            .attr("class", "area")
            .attr("d", area)
            .style("fill", (d, i) => color(i))
            .attr("transform", `translate(${margin.left},${margin.top})`);
    }, [normalizedData]);

    return <svg ref={ref} width={800} height={400}></svg>;
};

export default StackedAreaChart;
