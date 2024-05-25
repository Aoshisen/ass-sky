<script setup lang="ts">
import { A } from "../libs/A.ts";
import { ref, onMounted } from "vue";
const canvasEl = ref<HTMLCanvasElement>();
onMounted(() => {
  window.a = new A(400, canvasEl.value);
});
</script>
<template>
  <canvas ref="canvasEl" width="800" height="800"></canvas>
</template>
<style>
body {
  margin: 0;
  padding: 0;
}
</style>
