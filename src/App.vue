<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Sky } from "./sky";

let canvasEl = ref<HTMLCanvasElement>();
onMounted(() => {
  new Sky(canvasEl.value!);
});
</script>

<template>
  <canvas width="800" height="800" ref="canvasEl"></canvas>
</template>

<style>
body {
  background-color: #000;
}
</style>
