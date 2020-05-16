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
              <div class="flex-grow-1 align-self-center mx-2"></div>
              <div class="audio-time">{{ time }}</div>
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
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
          right
          class="menu-dropdown"
        >
          <template v-slot:button-content>
            <b-icon-three-dots-vertical style="color: #082448;" />
          </template>
          <b-dropdown-item @click="$emit('edit-audio', audio)"
            >編輯</b-dropdown-item
          >
          <b-dropdown-item @click="$emit('delete-audio', audio)"
            >刪除</b-dropdown-item
          >
        </b-dropdown>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { AudioData } from '../assets/ts/AudioData';
import Slider from '~/components/Slider.vue';

const audioPath = (id: number) => `/api/parent/audiofile/${id}`;

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
  @Prop({ default: {} }) readonly audio!: AudioData;

  clip: HTMLAudioElement | null = null;
  duration: number | null = null;
  position: number = 0;
  idle: boolean = true;
  animating: boolean = false;

  play() {
    if (!this.clip) {
      const path = audioPath(this.audio.id);
      this.clip = new Audio(path);
      this.clip.ondurationchange = () => {
        this.duration = this.clip!.duration;
      };
      this.clip.onended = () => {
        this.clip!.currentTime = 0;
        this.position = 0;
        this.idle = true;
      };
    }
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

  get time(): string {
    return this.audio.date.toUTCString().substr(17, 5);
  }
}
</script>

<style>
@font-face {
  font-family: 'HelveticaNeue';
  src: url('~assets/font/HelveticaNeueRegular.ttf') format('truetype');
}

.audiolog {
  background-color: #fde9d2;
  border-radius: 10px;
  min-height: 44px;
  display: flex;
  align-items: center;
}

.audiolog + .audiolog {
  margin-top: 11px;
}

.audio-time,
.progress-text {
  font: 9px/11px HelveticaNeue;
  color: #082448;
}

.menu-dropdown > button {
  padding: 0;
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
