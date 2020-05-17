<template>
  <div>
    <div
      class="ring"
      :class="{ half: v > 0.5 }"
      :style="{ '--d': `${v * 360 - 90}deg`, '--bg': bg, '--fg': fg }"
    ></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class classname extends Vue {
  @Prop({ default: 'grey' }) bg!: string;
  @Prop({ default: 'purple' }) fg!: string;
  @Prop({ default: 0 }) v!: number;
}
</script>

<style lang="scss">
.ring {
  background: linear-gradient(var(--d), var(--bg) 50%, transparent 50%),
    linear-gradient(to right, var(--bg) 50%, var(--fg) 50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  &.half {
    background: linear-gradient(var(--d), transparent 50%, var(--fg) 50%),
      linear-gradient(to right, var(--bg) 50%, var(--fg) 50%);
  }
}
</style>
