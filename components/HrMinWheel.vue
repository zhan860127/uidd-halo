<template>
  <div class="wheel-wrp">
    <template v-if="hrs">
      <TimeWheel
        :labels="hrs"
        class="wheel"
        @input="
          (e) => {
            h = e;
          }
        "
      />
      <TimeWheel :labels="mins" class="wheel" @input="(e) => (m = e)" />
      <div class="wheel-frame"></div>
      <div class="filter"></div>
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import TimeWheel from '~/components/TimeWheel.vue';

const allTimes = Array(24)
  .fill(0)
  .map((_v, i) => i)
  .flatMap((h) =>
    Array(60)
      .fill(0)
      .map((_v, i) => i)
      .map((m) => ({
        h,
        m,
      }))
  );

@Component({ components: { TimeWheel } })
export default class HrMinWheel extends Vue {
  @Prop({ default: () => allTimes }) times!: { h: number; m: number }[];
  prevMins: number[] = [];

  get hrs(): number[] {
    return [...new Set(this.times.map((x) => x.h))].sort((a, b) => a - b);
  }

  get mins(): number[] {
    const x = [
      ...new Set(this.times.filter((x) => x.h === this.h).map((x) => x.m)),
    ].sort((a, b) => a - b);
    if (
      x.length !== this.prevMins.length ||
      !x.every((v, i) => v === this.prevMins[i])
    ) {
      console.log(x);
      this.prevMins = x;
      this.m = this.mins[0];
    }
    return this.prevMins;
  }

  @Watch('hrs') onHrsChanged() {
    this.h = this.hrs[0];
  }

  h: number = 0;
  m: number = 0;

  created() {
    this.h = this.hrs[0];
    this.m = this.mins[0];
  }

  get val() {
    return { h: this.h, m: this.m };
  }

  @Watch('val') onValChange(v: { h: number; m: number }) {
    this.$emit('input', v);
  }
}
</script>
<style lang="scss" scoped>
.wheel-wrp {
  background-color: #141517;
  color: #c7c7ca;
  display: flex;
  justify-content: center;
  padding: 20px 0;
  position: relative;
}

.wheel + .wheel {
  margin-left: 50px;
}

.wheel-frame {
  border-top: 1px solid #fff3;
  border-bottom: 1px solid #fff3;
  height: 2em;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  left: 0;
  right: 0;
}
.filter {
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  pointer-events: none;
  background: linear-gradient(#000c, #0000, #000c);
}
</style>
