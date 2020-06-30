<template>
  <div>
    <HrMinWheel />
    <div class="hrow">
      <div>重複時間</div>
      <div>Week</div>
    </div>
    <div class="hrow">
      <div>聲音</div>
      <div>聲音2</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import '~/assets/scss/_fonts.scss';

import HrMinWheel from '~/components/HrMinWheel.vue';

@Component({
  layout: 'parent',
  components: { HrMinWheel },
})
export default class classname extends Vue {}
</script>
<style lang="scss" scoped>
.hrow {
  & {
    margin-top: 15px;
  }
  & + & {
    margin-top: 10px;
  }
  display: flex;
  color: #082448;
  & > div {
    background-color: #fff;
    box-shadow: 0px 3px 6px #00000029;
    padding-top: 17px;
    padding-bottom: 17px;
    font-family: 'Avenir Book', 'segoe ui', 'microsoft jhenghei',
      'microsoft mhei', stheititc, sans-serif;
    font-size: 15px;
    position: relative;
    &:nth-child(1) {
      padding-right: 20px;
      padding-left: 50px;
    }
    &:nth-child(2) {
      margin-left: 10px;
      flex-grow: 1;
      padding-right: 70px;
      padding-left: auto;
      text-align: right;
      &::after {
        position: relative;
        margin-left: 20px;
        content: '▶';
        font-size: 0.5em;
        vertical-align: middle;
      }
    }
  }
}
</style>
