<template>
  <div class="audiolog">
    <div class="audiolog-inner position-relative h-100 w-100">
      <div class="d-flex align-items-center px-1">
        <div class="d-flex align-items-center px-2">
          <b-icon
            :icon="animating ? 'pause-fill' : 'play-fill'"
            class="rounded-circle"
            style="background-color: #4d6790; color: #fde9d2;"
            @click="play"
          />
        </div>
        <div class="flex-grow-1 align-self-center mx-2">
          <transition name="fade" mode="out-in">
            <div v-if="idle" key="idle" class="d-flex">
              <slot name="center"> </slot>
            </div>
            <div v-else key="playing" class="d-flex">
              <div class="progress-text">
                {{ secToMinSec(position) }} / {{ secToMinSec(duration) }}
              </div>
              <div class="flex-grow-1 align-self-center ml-2">
                <Slider :max="duration ? duration : 1" :position="position" />
              </div>
            </div>
          </transition>
        </div>
        <slot name="right" />
      </div>
    </div>
    <div v-if="!idle && transcript" class="audio-transcript">
      {{ transcript }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import Slider from '~/components/Slider.vue';

import '~/assets/scss/_fonts.scss';

function padZero(val: number, n: number): string {
  const figs = val > 1 ? Math.ceil(Math.log10(val)) : 1;
  return (
    Array(Math.max(0, n - figs))
      .fill(0)
      .join('') + val
  );
}

@Component({ components: { Slider } })
export default class classname extends Vue {
  @Prop() path!: string;
  @Prop({ default: '' }) transcript!: string;

  clip: HTMLAudioElement | null = null;
  duration: number | null = null;
  position: number = 0;
  idle: boolean = true;
  animating: boolean = false;

  @Watch('path')
  onPathChange() {
    if (this.clip) {
      this.clip.pause();
    }
    this.loadPath();
  }

  loadPath() {
    this.clip = new Audio(this.path);
    this.idle = true;
    this.clip!.currentTime = 999999999; // Fix duration
    this.clip.ondurationchange = () => {
      this.clip!.currentTime = 0;
      this.duration = this.clip!.duration;
    };
    this.clip.onended = () => {
      this.clip!.currentTime = 0;
      this.position = 0;
      this.idle = true;
    };
  }

  play() {
    if (!this.clip) {
      this.loadPath();
    }
    if (!this.clip) throw new Error('no clip!');
    if (!(this.clip.paused || this.clip.ended)) {
      this.clip.pause();
      return;
    }
    this.clip.play();
    this.idle = false;
    this.updateProgress();
  }

  updateProgress() {
    const cb = () => {
      if (this.clip) this.position = this.clip.currentTime;
      if (!this.clip || this.clip.paused || this.clip.ended) {
        this.animating = false;
        return;
      }
      requestAnimationFrame(cb);
    };
    if (this.animating) return;
    this.animating = true;
    requestAnimationFrame(cb);
  }

  secToMinSec(secs: number): string {
    secs = Math.floor(secs);
    const m = Math.floor(secs / 60);
    const s = secs - m * 60;
    return `${padZero(m, 2)}:${padZero(s, 2)}`;
  }
}
</script>

<style lang="scss">
.audiolog {
  background-color: #fde9d2;
  border-radius: 10px;
  min-height: 44px;
  display: flex;
  align-items: center;
  position: relative;
}

.audiolog + .audiolog {
  margin-top: 11px;
}

.progress-text {
  font: 9px/11px HelveticaNeue;
  color: #082448;
}

.audio-transcript {
  position: absolute;
  top: 100%;
  background-color: #fcf6ef;
  left: 20px;
  right: 20px;
  z-index: 1;
  padding: 11px 33px 23px;
  font: 10px/14px 'Avenir Book', 'segoe ui', 'microsoft jhenghei',
    'microsoft mhei', stheititc, sans-serif;
  border-radius: 0 0 10px 10px;
}

/* make the play icon look more centered */
.bi-play-fill.rounded-circle > g {
  transform: translateX(0.045em);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
