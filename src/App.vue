<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import P5 from "p5";
const canvasEl = ref<HTMLCanvasElement>();
let w = window.innerWidth;
let h = window.innerHeight;
const offsetY = window.scrollY;

const SCALE = 200;
const LENGTH = 10;
const SPACING = 15;
const existingPoints = new Set<string>();
const points: { x: number; y: number; opacity: number }[] = [];

function addPoints() {
  for (let x = -SPACING / 2; x < w + SPACING; x += SPACING) {
    for (let y = -SPACING / 2; y < h + offsetY + SPACING; y += SPACING) {
      const id = `${x}-${y}`;
      if (existingPoints.has(id)) continue;
      existingPoints.add(id);
      points.push({ x, y, opacity: Math.random() * 0.5 + 0.5 });
    }
  }
}
let resizeEvent: () => void;
let unmount: () => void;
onMounted(() => {
  new P5((sketch) => {
    function getForceOnPoint(x: number, y: number, z: number) {
      return (sketch.noise(x / SCALE, y / SCALE, z) - 0.5) * 2 * sketch.TWO_PI;
    }
    sketch.setup = () => {
      sketch.createCanvas(w, h);
      sketch.noFill();
      sketch.noiseSeed(+new Date());
      addPoints();
    };
    sketch.draw = () => {
      sketch.background("#000");
      const t = +new Date() / 10000;
      for (const p of points) {
        const { x, y } = p;
        const rad = getForceOnPoint(x, y, t);
        const length =
          (sketch.noise(x / SCALE, y / SCALE, t * 2) + 0.5) * LENGTH;
        const nx = x + sketch.cos(rad) * length;
        const ny = y + sketch.sin(rad) * length;
        sketch.stroke(
          180,
          180,
          180,
          (Math.abs(sketch.cos(rad)) * 0.5 + 0.5) * p.opacity * 255
        );
        sketch.circle(nx, ny - offsetY, 1);
      }
    };
    resizeEvent = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      sketch.resizeCanvas(w, h);
      addPoints();
    };

    unmount = sketch.unmount;
    window.addEventListener("resize", resizeEvent);
  });
}, canvasEl.value as any);

onUnmounted(() => {
  window.removeEventListener("resize", resizeEvent);
  unmount();
});
</script>

<template>
  <div ref="canvasEl"></div>
</template>

<style>
body {
  background-color: #000;
}
</style>
