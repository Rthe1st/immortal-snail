import { useMemo, useState } from "react";
import * as d3 from "d3";

import "./Radar.css";

const Axis = ({ domain = [0, 100], range = [0, 450], x = 0, y = 0 }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(domain).range(range);
    const width = range[1] - range[0];
    // idea is that ticks have up to 3 digit labels that we need to mae space for
    const spacePerTick =
      parseInt(
        window.getComputedStyle(document.body).getPropertyValue("font-size")
      ) * 8;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / spacePerTick));
    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [domain.join("-"), range.join("-")]);
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path
        d={["M", range[0], 6, "v", -6, "H", range[1], "v", 6].join(" ")}
        fill="none"
        stroke="currentColor"
      />
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <circle
            cx={range[1] - xOffset}
            cy={0}
            r={range[1] - xOffset}
            fill="None"
            stroke="green"
            strokeWidth={4}
          />
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "2em",
              textAnchor: "middle",
              transform: "translateY(1em)",
            }}
          >
            {value + "m"}
          </text>
        </g>
      ))}
    </g>
  );
};

interface RadarProperties {
  snailX: number;
  snailY: number;
}

function Radar(props: RadarProperties) {
  const { snailX, snailY } = props;

  const distance = Math.sqrt(Math.pow(snailX, 2) + Math.pow(snailY, 2));

  const maxAxisValue =
    distance < 10
      ? 10
      : distance < 50
      ? 50
      : Math.sqrt(Math.pow(snailX, 2) + Math.pow(snailY, 2)) * 100;

  const maxRadarRange =
    distance < 10 ? 20 : distance < 50 ? 100 : distance < 100 ? 500 : 1000;

  const [radarRange, setRadarRange] = useState(maxAxisValue);

  const rings = Array(10).fill(0);
  const viewBoxHeight = 1000;
  const viewBoxWidth = 1000;

  const scaledSnailX = Math.max(-1, Math.min(1, snailX / radarRange)) * 500;
  const scaledSnailY = Math.max(-1, Math.min(1, snailY / radarRange)) * 500;

  // todo: should we be using D3 to do some of this animating/transforming?

  const radarSvg = (
    <svg className="radar" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
      <defs>
        <linearGradient
          id="linear-gradient"
          gradientUnits="userSpaceOnUse"
          x1="1000"
          y1="750"
          x2="500"
          y2="750"
        >
          <stop offset="90%" stopColor="green" stopOpacity="0%" />
          <stop offset="100%" stopColor="green" stopOpacity="100%" />
        </linearGradient>
        <mask id="cut-off-center">
          <rect width="100%" height="100%" fill="white" />
          <circle
            cx={viewBoxWidth / 2}
            cy={viewBoxWidth / 2}
            r={(viewBoxWidth - 100) / 2}
            fill="black"
          />
        </mask>
        <clipPath id="clip">
          <circle r="600" cx="500" cy="500" />
        </clipPath>
        <radialGradient id="myGradient">
          <stop offset="0%" stopColor="green" stopOpacity="100%" />
          <stop offset="100%" stopColor="white" stopOpacity="0%" />
        </radialGradient>
      </defs>
      <circle
        cx={viewBoxWidth / 2}
        cy={viewBoxWidth / 2}
        r={viewBoxWidth / rings.length}
        fill="green"
        stroke="green"
        strokeWidth={4}
      />
      <g>
        <foreignObject x="0" y="0" width="1000" height="1000" clip="url(#clip)">
          <div
            key="makemeunique"
            style={{
              width: "100%",
              height: "100%",
              background:
                "conic-gradient(transparent 150deg, green 180deg, transparent 181deg)",
            }}
          ></div>
        </foreignObject>
        <line
          x1={viewBoxWidth / 2}
          y1={viewBoxWidth / 2}
          x2={viewBoxWidth / 2}
          y2={viewBoxWidth}
          stroke="black"
        ></line>
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from={`0 ${viewBoxWidth / 2} ${viewBoxWidth / 2}`}
          to={`360 ${viewBoxWidth / 2} ${viewBoxWidth / 2}`}
          dur="10s"
          repeatCount="indefinite"
        />
      </g>
      <rect
        x="0"
        width={viewBoxWidth}
        y="0"
        height={viewBoxWidth}
        fill="green"
        mask="url(#cut-off-center)"
      ></rect>
      <Axis x={50} y={viewBoxWidth / 2} domain={[radarRange, 0]}></Axis>
      <g>
        <image
          x={500 + scaledSnailX - 40}
          y={500 + scaledSnailY - 40}
          width="80"
          height="80"
          // https://uxwing.com/snail-icon/</g>
          href="snail-icon.svg"
        ></image>
        <circle cx={500 + scaledSnailX} cy={500 + scaledSnailY} r="50">
          <animate
            attributeType="XML"
            attributeName="fill"
            values="url('#myGradient');transparent;"
            // values="green;transparent;"
            dur="5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );

  return (
    <>
      <div style={{ position: "relative" }}>
        {radarSvg}
        <div id="radar-control">
          <input
            className="radar-scale"
            list="radar-scale-values"
            type="range"
            min={10}
            max={maxRadarRange}
            step={10}
            orient="vertical"
            onChange={(event) =>
              setRadarRange(Number.parseInt(event.target.value))
            }
          />
          <datalist id="radar-scale-values">
            <option
              value={maxRadarRange}
              label={`${maxRadarRange}m`}
              style={{ flexGrow: 1 }}
            ></option>
            <option value="10" label="10m"></option>
          </datalist>
        </div>
      </div>
    </>
  );
}

export default Radar;
