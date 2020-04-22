import { css } from "@emotion/core";
import { useEffect, useRef } from "react";
import { theme } from "../theme";

export function GradientBackgrounds() {
  const gradientRef = useRef<SVGLinearGradientElement>(
    null
  );
  useEffect(() => {
    let frame = requestAnimationFrame(loop);

    let i = 0;
    function loop() {
      frame = requestAnimationFrame(loop);

      i += 0.1;
      if (i === 360) i = 0;

      gradientRef.current!.setAttribute(
        "gradientTransform",
        `rotate(${i})`
      );
    }

    return () => cancelAnimationFrame(frame);
  }, []);

  const getX = (x: number) => x - 1280;
  const getY = (y: number) => y - 720;
  const bottomBarHeight = 70;
  const gradientWidthPercentage = 0;

  return (
    <div
      css={css`
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      `}
    >
      <svg
        css={{ height: "100%", width: "100%" }}
        viewBox={`${getX(0)} ${getY(0)} 2560 1440`}
      >
        <defs>
          <linearGradient
            ref={gradientRef}
            id="main-gradient"
            gradientTransform="rotate(0)"
            x1={getX(0)}
            y1={getY(-560)}
            x2={getX(2560)}
            y2={getY(2560)}
            gradientUnits="userSpaceOnUse"
          >
            <stop
              offset={`${50 - gradientWidthPercentage}%`}
              stopColor={theme.colors.accentDark}
            />
            <stop
              offset={`${50 + gradientWidthPercentage}%`}
              stopColor={theme.colors.dark}
            />
          </linearGradient>
        </defs>
        <rect
          x={getX(0)}
          y={getY(0)}
          width="2560"
          height="1440"
          strokeWidth="30"
          stroke="url('#main-gradient')"
          fill="transparent"
        ></rect>
        <rect
          x={getX(2052)}
          y={getY(1053)}
          height="286"
          width="460"
          fill="transparent"
          stroke="url('#main-gradient')"
          strokeWidth="10"
        ></rect>
        <rect
          x={getX(0)}
          y={getY(1440 - bottomBarHeight)}
          height={bottomBarHeight}
          width="2560"
          fill="url('#main-gradient')"
        ></rect>
      </svg>
    </div>
  );
}
