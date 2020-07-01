<template>
  <div class="wrp" :style="{ '--size': size }">
    <div class="dot" :class="{ online: online }"></div>
    <div class="pic-ctn">
      <div
        :style="{
          'background-image': `url(/api/parent/childpic?id=${childId})`,
        }"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ChildStatus extends Vue {
  @Prop() online!: boolean;
  @Prop() childId!: number;
  @Prop({ default: '40px' }) size!: string;
}
</script>

<style lang="scss" scoped>
.wrp {
  height: var(--size);
  width: var(--size);
  position: relative;
}

.dot {
  position: absolute;
  height: 100% * 6 / 40;
  width: 100% * 6 / 40;
  top: 0;
  right: 0;
  border-radius: 50%;
  background-color: #666;
  &.online {
    background-color: #14ff00;
  }
}

.pic-ctn {
  border-radius: 50%;
  overflow: hidden;
  position: absolute;
  height: 100% * 36 / 40;
  width: 100% * 36 / 40;
  bottom: 0;
  top: 0;

  & > div {
    background-size: cover;
    background-position: center;
    height: 100%;
    width: 100%;
  }
}
</style>
