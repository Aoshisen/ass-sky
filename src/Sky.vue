<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Sky } from "./sky.ts";
const canvasEl = ref<HTMLCanvasElement>();
const width = ref(window.innerWidth);
const height = ref(window.innerHeight);
onMounted(() => {
  new Sky(canvasEl.value!);
});
window.addEventListener("resize", () => {
  width.value = window.innerWidth;
  height.value = window.innerHeight;
});
</script>

<template>
  <canvas ref="canvasEl" :width :height></canvas>
</template>

<style>
body {
  background-color: #000;
  padding: 0;
  margin: 0;
}
</style>
