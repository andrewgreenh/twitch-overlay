import { Delaunay } from "d3-delaunay";
import { useEffect, useRef } from "react";

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

  const { triangles } = d;

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i];
    const polygon = voronoi.cellPolygon(i);

    ctx.beginPath();
    ctx.moveTo(polygon[0][0], polygon[0][1]);
    for (const cord of polygon) {
      ctx.lineTo(cord[0], cord[1]);
    }
    ctx.lineTo(polygon[0][0], polygon[0][1]);

    const transparency = obj.seed / 100;

    ctx.fillStyle = `rgba(255, 255, 255, ${transparency})`;
    ctx.strokeStyle = `rgba(255, 255, 255, ${transparency})`;

    ctx.fill();
    ctx.stroke();

    ctx.closePath();
  }
  // for (let i = 2; i < triangles.length; i += 3) {
  //   const v1 = objects[triangles[i - 2]];
  //   const v2 = objects[triangles[i - 1]];
  //   const v3 = objects[triangles[i - 0]];
  //   const x1 = v1.position[0];
  //   const x2 = v1.position[1];
  //   const y1 = v2.position[0];
  //   const y2 = v2.position[1];
  //   const z1 = v3.position[0];
  //   const z2 = v3.position[1];

  // const area = Math.abs(
  //   (x1 * (y2 - z2) + y1 * (z2 - x2) + z1 * (x2 - y2)) / 2
  // );

  // const seedSum = (v1.seed + v2.seed + v2.seed) % 10;
  // const seedRatio = seedSum / 10;

  // const maxArea =
  //   ctx.canvas.width * ctx.canvas.height * 0.1;
  // const minArea =
  //   ctx.canvas.width * ctx.canvas.height * 0.01;
  // const clampedArea = Math.max(
  //   Math.min(area, maxArea),
  //   minArea
  // );

  // const areaRatio = 1 - clampedArea / (maxArea - minArea);

  // const transparency = seedRatio * 0.2;

  // ctx.beginPath();

  // ctx.fillStyle = `rgba(255, 255, 255, ${transparency})`;

  // ctx.moveTo(x1, x2);
  // ctx.lineTo(y1, y2);
  // ctx.lineTo(z1, z2);
  // ctx.lineTo(x1, x2);
  // ctx.fill();

  // ctx.closePath();
  // }
}
