<template>
  <div class="wrp">
    <div class="dot" :class="{ online: online }"></div>
    <div class="pic-ctn">
      <img :src="`/api/parent/childpic?id=${childId}`" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export default class ChildStatus extends Vue {
  @Prop() online!: boolean;
  @Prop() childId!: number;
}
</script>

<style lang="scss" scoped>
.wrp {
  height: 40px;
  width: 40px;
  position: relative;
}

.dot {
  position: absolute;
  height: 6px;
  width: 6px;
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
  height: 36px;
  width: 36px;
  bottom: 0;
  top: 0;

  & > img {
    object-fit: cover;
    object-position: center;
    height: 100%;
    width: 100%;
  }
}
</style>
