<template>
  <div class="wheel-wrp">
    <template v-if="hrs">
      <TimeWheel
        :labels="hrs"
        class="wheel"
        @input="
          (e) => {
            h = e;
            m = mins[0];
          }
        "
      />
      <TimeWheel :labels="mins" class="wheel" @input="(e) => (m = e)" />
    </template>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch, Prop } from 'vue-property-decorator';
import TimeWheel from '~/components/TimeWheel.vue';

@Component({ components: { TimeWheel } })
export default class HrMinWheel extends Vue {
  @Prop() times!: { h: number; m: number }[];

  get hrs(): number[] {
    return [...new Set(this.times.map((x) => x.h))].sort();
  }

  get mins(): number[] {
    return [
      ...new Set(this.times.filter((x) => x.h === this.h).map((x) => x.m)),
    ].sort();
  }

  h: number = 0;
  m: number = 0;

  created() {
    this.h = this.hrs[0];
    this.m = this.mins[0];
  }

  @Watch('times') onTimesChanged() {
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
}

.wheel + .wheel {
  margin-left: 50px;
}
</style>
