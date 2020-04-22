import { css, Global } from "@emotion/core";
import React, { useEffect, useRef, useState } from "react";
import { theme } from "../../shared/overlay/theme";

export function App() {
  const dimensions = useWindowDimensions();
  const pathRef = useRef<SVGPathElement>(null);
  const trailRef = useRef<SVGPathElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    if (!dimensions) return;

    let i = 0;
    function loop() {
      i = (i + 1 * 0.1) % 100;

      let percentage = i / 100;

      const pathLength = pathRef.current!.getTotalLength();
      const { x, y } = pathRef.current!.getPointAtLength(
        pathLength * percentage
      );

      const trailLength = 1500;

      circleRef.current!.style.transform = `translate(${x}px, ${y}px)`;
      trailRef.current!.style.strokeDasharray = `0 ${
        pathLength - trailLength
      } ${trailLength} 0`;

      trailRef.current!.style.strokeDashoffset =
        -1 * percentage * pathLength + "";

      frame = requestAnimationFrame(loop);
    }

    let frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, [dimensions]);

  if (!dimensions) return null;

  const { width, height } = dimensions;

  const strokeWidth = 20;
  const borderPadding = 20;
  const p = strokeWidth / 2 + borderPadding;
  const gradientPercentages = [
    0.98,
    0.95,
    0.9,
    0.7,
    0.5,
    0.3,
    0.1,
    0.05,
    0.02,
    0,
  ];

  return (
    <>
      <Global
        styles={css`
          html {
            background: transparent;
          }
        `}
      />
      <svg
        css={{
          width,
          height,
        }}
      >
        <defs>
          <radialGradient
            id="gradient"
            cx="50%"
            cy="50%"
            r="50%"
            fx="50%"
            fy="50%"
          >
            {gradientPercentages.map((p, i) => (
              <stop
                key={i}
                offset={i * 10 + "%"}
                stopColor={"white"}
                stopOpacity={p}
              />
            ))}
          </radialGradient>
          <linearGradient
            id="linear-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              stopColor={theme.colors.accentLight}
              stopOpacity="1"
            />
            <stop
              offset="100%"
              stopColor={theme.colors.dark}
              stopOpacity="1"
            />
          </linearGradient>
        </defs>
        <path
          ref={pathRef}
          d={[
            `M${p},${p}`,
            `l${width - 2 * p},0`,
            `l0,${height - 2 * p}`,
            `l${-1 * (width - 2 * p)},0`,
            `l0,${-1 * (height - 2 * p)}`,
          ].join(" ")}
          css={{
            stroke: theme.colors.accentDark,
            opacity: 0,
            strokeWidth,
            fill: "transparent",
          }}
        />
        <path
          ref={trailRef}
          d={[
            `M${p},${p}`,
            `l${width - 2 * p},0`,
            `l0,${height - 2 * p}`,
            `l${-1 * (width - 2 * p)},0`,
            `l0,${-1 * (height - 2 * p)}`,
          ].join(" ")}
          stroke="url(#linear-gradient)"
          strokeLinecap="round"
          css={{
            strokeWidth,
            fill: "transparent",
          }}
        />

        <circle
          ref={circleRef}
          cx={0}
          cy={0}
          r={strokeWidth * 2}
          fill="url(#gradient)"
        />
      </svg>
    </>
  );
}

export default App;

function useWindowDimensions() {
  const [dimensions, setDimensions] = useState(
    null as null | { width: number; height: number }
  );

  useEffect(() => {
    const {
      clientWidth,
      clientHeight,
    } = document.documentElement;
    setDimensions({
      width: clientWidth,
      height: clientHeight,
    });
  }, []);

  return dimensions;
}
