<template>
  <div class="audiolog">
    <div
      class="audio-progress"
      :style="{ width: duration ? `${(100 * position) / duration}%` : 0 }"
    ></div>
    <div class="audio-content">
      <b-button @click="play">▶</b-button>
      {{ audio.transcript }}
      {{ secToMinSec(position) }} / {{ secToMinSec(duration) }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';

const audioPath = (id: number) => `/api/parent/audiofile/${id}`;

function padZero(val: number, n: number): string {
  const figs = val > 1 ? Math.ceil(Math.log10(val)) : 1;
  return (
    Array(Math.max(0, n - figs))
      .fill(0)
      .join('') + val
  );
}

interface AudioData {
  id: number;
  transcript: string;
  date: Date;
}

@Component
export default class classname extends Vue {
  @Prop({ default: {} }) readonly audio!: AudioData;

  clip: HTMLAudioElement | null = null;
  duration: number | null = null;
  position: number = 0;

  play() {
    const path = audioPath(this.audio.id);
    const audio = new Audio(path);
    this.clip = audio;
    audio.ondurationchange = () => {
      this.duration = audio.duration;
    };
    audio.play();
    this.updateProgress();
  }

  updateProgress() {
    const cb = () => {
      if (this.clip) this.position = this.clip.currentTime;
      if (!this.clip || this.clip.ended) {
        return;
      }
      requestAnimationFrame(cb);
    };
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

<style>
.audiolog {
  background: azure;
  padding: 0.3em 0.7em;
  position: relative;
}

.audiolog + .audiolog {
  margin-top: 5px;
}

.audio-content {
  position: relative;
  z-index: 1;
}

.audio-progress {
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  background: blue;
  opacity: 0.1;
}
</style>
