<template>
  <div class="drawer-root">
    <div
      class="drawer-backdrop"
      :class="{ active: value }"
      @click="$emit('input', false)"
    ></div>
    <div class="drawer" :class="[value ? 'active' : '', side]">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Model, Prop } from 'vue-property-decorator';

@Component
export default class Drawer extends Vue {
  @Model('input', { default: false }) value!: boolean;
  @Prop() side!: 'left' | 'right' | 'top' | 'bottom';
}
</script>

<style lang="scss" scoped>
.drawer-root {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 2;
}

.drawer-backdrop {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  transition: all 300ms ease;
  &.active {
    pointer-events: initial;
    background-color: #0003;
  }
}

.drawer {
  position: absolute;
  transition: all 300ms ease;
  pointer-events: initial;

  &.top {
    width: 100%;
    bottom: 100%;
    &.active {
      transform: translateY(100%);
    }
  }

  &.bottom {
    width: 100%;
    top: 100%;
    &.active {
      transform: translateY(-100%);
    }
  }

  &.left {
    height: 100%;
    right: 100%;
    &.active {
      transform: translateX(100%);
    }
  }

  &.right {
    height: 100%;
    left: 100%;
    &.active {
      transform: translateX(-100%);
    }
  }
}
</style>
