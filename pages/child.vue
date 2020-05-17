<template>
  <div>
    Child's main page <br />
    Sends audio to server
    <div>Vol: {{ volume }}</div>
    <b-button @click="record">Record</b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import Recorder from '~/assets/ts/Recorder';

@Component({})
export default class classname extends Vue {
  recorder = new Recorder();
  volume = 0;
  async record() {
    this.recorder.onSpeechEnd = this.onSpeechEnd;
    await this.recorder.start();
    this.showVol();
  }

  showVol() {
    this.volume = this.recorder.getVolume();
    requestAnimationFrame(this.showVol);
  }

  onSpeechEnd(blob: Blob) {
    const fd = new FormData();
    fd.append('data', blob);
    this.$axios
      .$post('/api/child/speech', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((d) => {
        console.log(d?.transcript || 'none');
      })
      .catch();
  }
}
</script>

<style>
.bar {
  background-color: antiquewhite;
  width: 300px;
}

.bar-inner {
  background-color: aqua;
  height: 30px;
  width: 200px;
}

audio {
  display: block;
}
</style>
