<template>
  <div class="wrapper">
    <div class="bar"></div>
    <div class="tick" :style="{ left: `${ratio * 100}%` }"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, PropSync } from 'vue-property-decorator';

// TODO: make it draggable
@Component
export default class Slider extends Vue {
  @Prop({ default: 0 }) min!: number;
  @Prop({ default: 1 }) max!: number;
  @PropSync('position') syncedPosition!: number;

  get ratio(): number {
    return (this.syncedPosition - this.min) / (this.max - this.min);
  }
}
</script>

<style scoped>
.wrapper {
  height: 10px;
  position: relative;
}

.bar {
  height: 2px;
  width: 100%;

  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #082448;
}

.tick {
  position: absolute;
  width: 2px;
  height: 100%;
  background-color: #082448;
}
</style>
