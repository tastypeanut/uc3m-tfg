import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { DataEntry } from '../types/types'; // Import your DataEntry interface

interface D3BarChartProps {
    data: DataEntry[];
}

const D3BarChart: React.FC<D3BarChartProps> = ({ data }) => {
    const d3Container = useRef<SVGSVGElement | null>(null);

    useEffect(() => {
        if (data && d3Container.current) {
            // Sort data by 'Anyo' in ascending order
            const sortedData = [...data].sort((a, b) => a.Anyo - b.Anyo);

            const svg = d3.select(d3Container.current);

            // Set dimensions
            const width = 500;
            const height = 300;
            const margin = { top: 20, right: 20, bottom: 30, left: 40 };

            // Clear any existing content
            svg.selectAll("*").remove();

            // Set up scales
            const xScale = d3.scaleBand()
                .domain(sortedData.map(d => d.Anyo.toString()))
                .rangeRound([margin.left, width - margin.right])
                .padding(0.1);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(sortedData, d => d.Valor) ?? 0])
                .range([height - margin.bottom, margin.top]);

            // Append bars
            svg.append('g')
                .attr('fill', 'steelblue')
                .selectAll('rect')
                .data(sortedData)
                .join('rect')
                .attr('x', d => xScale(d.Anyo.toString()) ?? 0)
                .attr('y', d => yScale(d.Valor) ?? 0)
                .attr('height', d => yScale(0) - (yScale(d.Valor) ?? 0))
                .attr('width', xScale.bandwidth());

            // Add X axis
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale));

            // Add Y axis
            svg.append('g')
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));
        }
    }, [data]); // Effect depends on the 'data' prop

    return (
        <svg
            className="d3-component"
            width={500}
            height={300}
            ref={d3Container}
        />
    );
};

export default D3BarChart;
