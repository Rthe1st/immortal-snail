import * as d3 from "d3";
import { headingDistanceTo } from "geolocation-utils";
import { useEffect, useRef } from "react";
import { SnailLogInformation } from "./snailAi";

export default function Death(props: {
  locationLog: SnailLogInformation[];
  reset: () => void;
}) {
  const { locationLog, reset } = props;
  const distances: { distance: number; time: number }[] = [];

  for (const log of locationLog) {
    const headingDistance = headingDistanceTo(log.location, log.playerLocation);
    distances.push({ time: log.timestamp, distance: headingDistance.distance });
  }
  const d3Container = useRef(null);

  useEffect(() => {
    if (!d3Container.current) {
      return;
    }
    // set the dimensions and margins of the graph
    const margin = { top: 10, right: 30, bottom: 30, left: 60 },
      width = 460 - margin.left - margin.right,
      height = 400 - margin.top - margin.bottom;

    // append the svg object to the body of the page

    const svg = d3.select(d3Container.current);

    const g = svg
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
      .scaleTime()
      .domain(d3.extent(distances, (d) => new Date(d.time)) as any)
      .range([0, width]);
    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).tickValues(x.domain()));
    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain(d3.extent(distances, (d) => d.distance) as any)
      .range([height, 0]);

    g.append("g").call(d3.axisLeft(y));
    // Add the line
    g.append("path")
      .datum(distances as any)
      .attr("fill", "none")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x((d: any) => x(d.time))
          .y((d: any) => y(d.distance))
      );
    // // Add the points
    g.append("g")
      .selectAll("dot")
      .data(distances as any)
      .join("circle")
      .attr("cx", (d: any) => x(d.time))
      .attr("cy", (d: any) => y(d.distance))
      .attr("r", 5)
      .attr("fill", "#69b3a2");
  }, [d3Container.current]);

  return (
    <>
      <p>Caught by snail!</p>
      <button onClick={reset}>Try again</button>
      <svg
        className="d3-component"
        width={400}
        height={200}
        ref={d3Container}
      />
    </>
  );
}
