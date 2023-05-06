import { useMemo } from "react";
import * as d3 from "d3";

const Axis = ({ domain = [0, 100], range = [0, 500], x = 0, y = 0 }) => {
  const ticks = useMemo(() => {
    const xScale = d3.scaleLinear().domain(domain).range(range);
    const width = range[1] - range[0];
    const pixelsPerTick = 30;
    const numberOfTicksTarget = Math.max(1, Math.floor(width / pixelsPerTick));
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
          <line y2="6" stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
};

interface RadarProperties {
  // should is br doing this with css?
  width: number;
  height: number;
  snailX: number;
  snailY: number;
}

function Radar(props: RadarProperties) {
  const rings = Array(10).fill(0);
  const viewBoxHeight = 1000;
  const viewBoxWidth = 1000;

  // todo: should we be using D3 to do some of this animating/transforming?

  return (
    <svg viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}>
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
            r={viewBoxWidth / 2}
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
      {rings.map((_, i) => (
        <circle
          cx={viewBoxWidth / 2}
          cy={viewBoxWidth / 2}
          r={((i + 1) * (viewBoxWidth / rings.length)) / 2}
          fill="None"
          stroke="green"
          strokeWidth={4}
        />
      ))}
      <g>
        <image
          x={500 + Math.min(props.snailX, 500) - 40}
          y={500 + Math.min(props.snailY, 500) - 40}
          width="80"
          height="80"
          // https://uxwing.com/snail-icon/</g>
          href="snail-icon.svg"
        ></image>
        <circle
          cx={500 + Math.min(props.snailX, 500)}
          cy={500 + Math.min(props.snailY, 500)}
          r="50"
        >
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
      <Axis x={viewBoxWidth / 2} y={viewBoxWidth / 2}></Axis>
      <rect
        x="0"
        width={viewBoxWidth}
        y="0"
        height={viewBoxWidth}
        fill="green"
        mask="url(#cut-off-center)"
      ></rect>
    </svg>
  );
}

export default Radar;
