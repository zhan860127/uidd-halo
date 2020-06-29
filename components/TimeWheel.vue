<template>
  <div
    ref="wheelCtn"
    class="ctn"
    :style="{ height: `${r * 2}px` }"
    @mousemove="onMouseMove"
    @mousedown="onMouseDown"
    @mouseup="onDragEnd"
    @mouseleave="onDragEnd"
  >
    <div
      v-for="p in labelParams"
      :key="p.val"
      :style="labelStyle(p.deg)"
      class="wheel-label"
    >
      {{ p.val }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';

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
  @Ref('wheelCtn') wheelCtn!: HTMLDivElement;

  val: number = 0;
  r: number = r;
  vy: number = 0;

  labels: number[] = new Array(60).fill(0).map((_v, i) => i + 1);
  prevTheta: number | null = null;
  prevTime: number | null = 0;

  centerIndex: number = 0;
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

  onMouseDown(e: MouseEvent) {
    this.prevTime = +new Date();
    this.spinning = false;
    this.vy = 0;
    this.prevTheta =
      (Math.asin(
        clip((e.clientY - this.wheelCtn.clientHeight / 2) / r, -1, 1)
      ) *
        180) /
      Math.PI;
  }

  onMouseMove(e: MouseEvent) {
    if (this.prevTheta === null || this.prevTime === null) return;
    this.spinning = false;
    const t0 = +new Date();
    const dt = t0 - this.prevTime;
    this.prevTime = t0;
    const t =
      (Math.asin(
        clip((e.clientY - this.wheelCtn.clientHeight / 2) / r, -1, 1)
      ) *
        180) /
      Math.PI;
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
    if (!offset) return;
    const thres = 0.01;
    console.log(offset);
    requestAnimationFrame(() => {
      this.centerIndex =
        Math.abs(offset) < thres
          ? Math.round(this.centerIndex)
          : Math.round(this.centerIndex) + offset * 0.95;
      this.snap();
    });
  }

  onDragEnd() {
    this.prevTheta = null;
    if (this.vy) {
      this.spinning = true;
      this.spin();
    }
  }
}
</script>
<style lang="scss" scoped>
.ctn {
  background-color: #141517;
  color: #c7c7ca;
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
