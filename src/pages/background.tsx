import { Delaunay } from "d3-delaunay";
import { scaleLinear } from "d3-scale";
import { lighten } from "polished";
import { useEffect, useRef } from "react";
import { theme } from "../shared/overlay/theme";

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    return startAnimation(canvasRef.current!);
  }, []);
  return <canvas ref={canvasRef}></canvas>;
}

export default Background;

function startAnimation(canvas: HTMLCanvasElement) {
  const {
    height,
    width,
  } = canvas.parentElement!.getBoundingClientRect();
  canvas.width = width;
  canvas.height = height;

  const objects: WorldObject[] = [];

  for (let i = 0; i < 50; i++) {
    const velocityRange = 0.1;
    objects.push(
      new WorldObject(
        [rand(0, width), rand(0, height)],
        [
          rand(-velocityRange, velocityRange),
          rand(-velocityRange, velocityRange),
        ],
        [width, height]
      )
    );
  }

  const ctx = canvas.getContext("2d")!;

  let cancelled = false;

  function gameLoop() {
    if (cancelled) return;
    ctx.clearRect(0, 0, width, height);

    for (const o of objects) {
      o.update();
      // o.paint(ctx);
    }
    printTriangles(objects, ctx, [width, height]);

    requestAnimationFrame(gameLoop);
  }

  gameLoop();

  return function cleanup() {
    cancelled = true;
  };
}

type Coord = [number, number];

class WorldObject {
  public seed = rand(0, 100);
  constructor(
    public position: Coord,
    public velocity: Coord,
    public maxPosition: Coord
  ) {}
  update() {
    this.seed = (this.seed + 0.2) % 100;
    this.position[0] += this.velocity[0];
    this.position[1] += this.velocity[1];

    if (this.position[0] < 0)
      this.velocity[0] = -1 * this.velocity[0];
    if (this.position[1] < 0)
      this.velocity[1] = -1 * this.velocity[1];
    if (this.position[0] > this.maxPosition[0])
      this.velocity[0] = -1 * this.velocity[0];
    if (this.position[1] > this.maxPosition[1])
      this.velocity[1] = -1 * this.velocity[1];
  }

  paint(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();

    ctx.fillStyle = "blue";
    ctx.arc(
      this.position[0],
      this.position[1],
      5,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.closePath();
  }
}

function rand(min = 0, max = 1) {
  const distance = max - min;
  return Math.random() * distance + min;
}

function printTriangles(
  objects: WorldObject[],
  ctx: CanvasRenderingContext2D,
  maxPosition: Coord
) {
  const d = Delaunay.from(objects.map((o) => o.position));
  const voronoi = d.voronoi([
    0,
    0,
    maxPosition[0],
    maxPosition[1],
  ]);

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    const polygon = voronoi.cellPolygon(i);

    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (const cord of polygon) {
      ctx.lineTo(cord[0], cord[1]);
    }
    ctx.lineTo(polygon[0][0], polygon[0][1]);

    const colorScale = scaleLinear<string>()
      .domain([0, 50, 100])
      .range([
        theme.colors.dark,
        lighten(0.2, theme.colors.dark),
        theme.colors.dark,
      ]);

    ctx.fillStyle = colorScale(obj.seed)!;

    ctx.fill();

    ctx.closePath();
  }
}
