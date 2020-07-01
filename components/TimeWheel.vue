<template>
  <div
    ref="wheelCtn"
    class="ctn"
    :style="{ height: `${r * 2}px` }"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @touchstart="onMouseDown"
    @touchend="onDragEnd"
    @mouseup="onDragEnd"
    @mouseleave="onDragEnd"
    @touchmove="onMouseMove"
  >
    <div
      v-for="(p, i) in labelParams"
      :key="i"
      :style="labelStyle(p.deg)"
      class="wheel-label"
    >
      {{ p.val }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Prop, Watch } from 'vue-property-decorator';

const theta = 20;
const r = 90;
const friction = 0.00001;
function rem(v: number, m: number) {
  return ((v % m) + m) % m;
}

function clip(v: number, min: number, max: number) {
  return v < min ? min : v > max ? max : v;
}

@Component
export default class TimeWheel extends Vue {
  @Prop() labels!: number[];

  @Ref('wheelCtn') wheelCtn!: HTMLDivElement;

  val: number = 0;
  r: number = r;
  vy: number = 0;

  @Watch('labels') onLabelsChange() {
    this.centerIndex = 0;
    this.prevIndex = 0;
    this.spinning = false;
    this.prevTheta = null;
  }

  prevTheta: number | null = null;
  prevTime: number | null = 0;

  centerIndex: number = 0;
  prevIndex: number = 0;
  spinning: boolean = false;

  get labelParams(): { val: number; deg: number }[] {
    let out = [];
    const c = Math.floor(this.centerIndex);
    let i = c;
    for (let x = 0; x < 100; ++x) {
      const t = (i - this.centerIndex) * theta;
      if (t <= -90) break;
      out.push({ val: this.labels[rem(i, this.labels.length)], deg: t });
      --i;
    }
    out = out.reverse();
    i = c + 1;
    for (let x = 0; x < 100; ++x) {
      const t = (i - this.centerIndex) * theta;
      if (t >= 90) break;
      out.push({ val: this.labels[rem(i, this.labels.length)], deg: t });
      ++i;
    }
    return out;
  }

  labelStyle(theta: number) {
    return {
      transform: `translate(-50%, -50%) translateY(${
        r * Math.sin((theta / 180) * Math.PI)
      }px) rotateX(${theta}deg)`,
    };
  }

  getTheta(e: MouseEvent | TouchEvent) {
    const y = e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
    return (
      (Math.asin(
        clip(
          (y -
            this.wheelCtn.getBoundingClientRect().top -
            this.wheelCtn.clientHeight / 2) /
            r,
          -1,
          1
        )
      ) *
        180) /
      Math.PI
    );
  }

  onMouseDown(e: MouseEvent | TouchEvent) {
    console.log('down');
    this.prevTime = +new Date();
    this.spinning = false;
    this.vy = 0;
    this.prevTheta = this.getTheta(e);
  }

  onMouseMove(e: MouseEvent | TouchEvent) {
    e.preventDefault();
    if (this.prevTheta === null || this.prevTime === null) return;
    console.log('nv');
    this.spinning = false;
    const t0 = +new Date();
    const dt = t0 - this.prevTime;
    this.prevTime = t0;
    const t = this.getTheta(e);
    const dTheta = t - this.prevTheta;
    this.centerIndex = rem(
      this.centerIndex - dTheta / theta,
      this.labels.length
    );
    this.vy = -dTheta / theta / clip(dt, 1, Number.POSITIVE_INFINITY);

    this.prevTheta = t;
  }

  spin() {
    if (!this.vy || !this.spinning) return this.snap();
    const t0 = +new Date();
    requestAnimationFrame(() => {
      const dt = +new Date() - t0;
      this.centerIndex = rem(
        this.centerIndex + this.vy * dt,
        this.labels.length
      );
      const v = Math.abs(this.vy);
      const dv =
        friction * dt * (this.centerIndex - Math.floor(this.centerIndex));
      this.vy = v < dv ? 0 : Math.sign(this.vy) * (v - dv);
      this.spin();
    });
  }

  snap() {
    // FIXME
    const offset = this.centerIndex - Math.round(this.centerIndex);
    if (!offset) {
      if (this.prevIndex !== this.centerIndex) {
        this.$emit('input', this.labels[this.centerIndex]);
        this.prevIndex = this.centerIndex;
      }
      return;
    }
    const thres = 0.01;
    requestAnimationFrame(() => {
      this.centerIndex = rem(
        Math.abs(offset) < thres
          ? Math.round(this.centerIndex)
          : Math.round(this.centerIndex) + offset * 0.8,
        this.labels.length
      );
      this.snap();
    });
  }

  onDragEnd() {
    this.prevTheta = null;
    this.spinning = true;
    this.spin();
  }
}
</script>
<style lang="scss" scoped>
.ctn {
  position: relative;
  width: 50px;
}

.wheel-label {
  position: absolute;
  left: 50%;
  top: 50%;
  font-size: 24px;
  transform: translate(-50%, -50%);
  user-select: none;
}
</style>
