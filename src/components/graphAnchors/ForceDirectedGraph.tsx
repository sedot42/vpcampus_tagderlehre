import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

interface ChordData {
  tags: string[];
  matrix: number[][];
}

export const ForceDirectedGraph: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Process data to generate chord diagram data
  const processData = () => {
    const tags = [
      "Lehre",
      "HS24",
      "BSc",
      "FHNW",
      "HABG",
      "Apero",
      "Foyer",
      "Yoga",
      "Sport",
      "Park",
    ];
    const matrix = Array.from(Array(tags.length), () => Array(tags.length).fill(0));

    const tagPairs: { [key: string]: { [key: string]: number } } = {};
    const incrementPair = (source: string, target: string) => {
      if (!tagPairs[source]) tagPairs[source] = {};
      if (!tagPairs[target]) tagPairs[target] = {};
      tagPairs[source][target] = (tagPairs[source][target] || 0) + 1;
      tagPairs[target][source] = (tagPairs[target][source] || 0) + 1;
    };

    incrementPair("Lehre", "BSc");
    incrementPair("HS24", "Lehre");
    incrementPair("BSc", "Sport");
    incrementPair("Sport", "Yoga");
    incrementPair("Yoga", "Park");
    incrementPair("Apero", "Foyer");
    incrementPair("Foyer", "Yoga");

    tags.forEach((source, i) => {
      tags.forEach((target, j) => {
        matrix[i][j] = tagPairs[source]?.[target] || 0;
      });
    });

    return { tags, matrix };
  };

  useEffect(() => {
    if (!svgRef.current || !tooltipRef.current) return;

    const { tags, matrix } = processData();
    const width = 800;
    const height = 800;
    const radius = Math.min(width, height) / 2;

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);

    const chord = d3.chord().padAngle(0.05).sortSubgroups(d3.descending);

    const arc = d3
      .arc()
      .innerRadius(radius - 100)
      .outerRadius(radius - 50);

    const ribbon = d3.ribbon().radius(radius - 100);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const chords = chord(matrix);

    const group = svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("g")
      .data(chords.groups)
      .enter()
      .append("g");

    group
      .append("path")
      .style("fill", (d) => color(String(d.index)))
      .style("stroke", (d) =>
        d3
          .rgb(color(String(d.index)))
          .darker()
          .toString()
      )
      .attr("d", arc.toString())
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("opacity", 0.8);
        tooltipRef.current!.style.opacity = "1";
        tooltipRef.current!.textContent = tags[d.index];
      })
      .on("mousemove", (event) => {
        const [x, y] = d3.pointer(event);
        tooltipRef.current!.style.top = `${y + 15}px`;
        tooltipRef.current!.style.left = `${x + 15}px`;
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).style("opacity", 1);
        tooltipRef.current!.style.opacity = "0";
      });

    // Adding text to arcs
    group
      .append("text")
      .attr("dy", ".35em")
      .append("textPath")
      .attr("xlink:href", (d) => `#${d.index}`)
      .text((d) => tags[d.index])
      .style("fill", "#000")
      .style("font-size", "12px");

    svg
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`)
      .selectAll("path")
      .data(chords)
      .enter()
      .append("path")
      .attr("d", ribbon.toString())
      .style("fill", (d) => color(d.target.index.toString()))
      .style("stroke", (d) =>
        d3.rgb(color(d.target.index.toString())).darker().toString()
      )
      .on("mouseover", (event, d) => {
        d3.select(event.currentTarget).style("opacity", 0.8);
        tooltipRef.current!.style.opacity = "1";
        tooltipRef.current!.textContent = `${tags[d.source.index]} → ${
          tags[d.target.index]
        }`;
      })
      .on("mousemove", (event) => {
        const [x, y] = d3.pointer(event);
        tooltipRef.current!.style.top = `${y + 15}px`;
        tooltipRef.current!.style.left = `${x + 15}px`;
      })
      .on("mouseout", (event) => {
        d3.select(event.currentTarget).style("opacity", 1);
        tooltipRef.current!.style.opacity = "0";
      });

    return () => {
      svg.selectAll("*").remove();
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <svg ref={svgRef}></svg>
      <div
        ref={tooltipRef}
        style={{
          position: "absolute",
          backgroundColor: "white",
          border: "1px solid #ccc",
          padding: "5px",
          borderRadius: "4px",
          pointerEvents: "none",
          opacity: 0,
          transition: "opacity 0.2s, top 0.2s, left 0.2s",
        }}
      ></div>
    </div>
  );
};
