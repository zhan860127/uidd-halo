<template>
  <div style="width: fit-content;">
    <input
      ref="input"
      type="file"
      class="d-none"
      accept="image/png, image/jpeg"
      @change="onChange"
    />
    <div class="input-wrp">
      <div class="frame" @click="onPlusClick">
        <div v-if="src" :style="{ 'background-image': `url(${src})` }" />
      </div>
      <b-icon-plus-circle-fill class="input-plus" @click="onPlusClick" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Model } from 'vue-property-decorator';

@Component
export default class ImgInput extends Vue {
  @Model('input') src!: string;

  @Ref('input') input!: HTMLInputElement;
  onChange(e: InputEvent) {
    const file = (e.srcElement as HTMLInputElement)!.files![0];
    if (!file) {
      this.src = '';
      return;
    }
    this.$emit('input', URL.createObjectURL(file));
  }

  onPlusClick() {
    this.input.click();
  }
}
</script>

<style lang="scss" scoped>
.frame {
  width: 185px;
  height: 185px;
  border-radius: 50%;
  border: 1px solid #707070;
  overflow: hidden;
  background-color: #707070;
  & > div {
    height: 100%;
    width: 100%;
    background-size: cover;
    background-position: center;
  }
  position: relative;
}
.input-plus {
  position: absolute;
  bottom: 14.644%;
  right: 14.644%;
  transform: translate(50%, 50%);
  font-size: 24px;
}
.input-wrp {
  position: relative;
  width: fit-content;
}
</style>
