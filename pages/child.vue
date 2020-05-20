<template>
  <div class="child-root">
    <Pie class="pie abs-center" :v="smoothedVol" bg="#CCCCCC" :fg="color" />
    <div class="inner abs-center"></div>
    <div class="photo abs-center" style="--pic: url('/copy.png');"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';
import io from 'socket.io-client';
import Recorder from '~/assets/ts/Recorder';
import Pie from '~/components/Pie.vue';

const alpha = 0.5;

@Component({ components: { Pie } })
export default class classname extends Vue {
  recorder = new Recorder();
  volume = 0;
  smoothedVol = 0;
  audio: HTMLAudioElement | null = null;
  responseAudio: HTMLAudioElement | null = null;

  async mounted() {
    const Peer = (await import('peerjs')).default;
    const peer = new Peer({
      debug: 2,
    });
    peer.on('open', function () {
      const socket = io('/child').on('connect', () => {
        console.log(`peer_id: ${peer.id}`);
        socket.emit('peer_id', peer.id);
      });
    });
    peer.on('call', async (call) => {
      console.log('received call');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      call.answer(stream);
      call.on('stream', (stream) => {
        console.log('got remote stream');
        this.recorder.stop();
        if (this.audio) this.audio.pause();
        this.audio = new Audio();
        this.audio.srcObject = stream;
        this.audio.play();
      });
      call.on('close', () => {
        console.log('remote stream closed');
        if (this.audio) this.audio.pause();
        this.recorder.start();
      });
      call.on('error', (err) => {
        console.error('call error', err);
        if (this.audio) this.audio.pause();
        this.recorder.start();
      });
    });
    this.record();
  }

  @Watch('volume')
  onVolChange(vol: number) {
    this.smoothedVol = alpha * vol + (1 - alpha) * this.smoothedVol;
  }

  get color(): string {
    return this.smoothedVol < 0.5
      ? '#FDE9D2'
      : this.smoothedVol < 0.75
      ? '#FABF4D'
      : '#B51E41';
  }

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
        console.log(d);
        if (d.keyword) {
          this.recorder.stop();
          if (this.responseAudio) this.responseAudio.pause();
          this.responseAudio = new Audio();
          this.responseAudio.onended = () => {
            this.responseAudio = null;
            this.recorder.start();
          };
          this.responseAudio.src = d.keyword.audioData;
          this.responseAudio.play();
        }
      })
      .catch();
  }
}
</script>

<style>
.abs-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.pie {
  width: 300px;
  height: 300px;
}

.child-root {
  position: relative;
  min-height: 100vh;
  background-color: #fcf6ef;
}

.inner {
  width: 250px;
  height: 250px;
  background-color: #fcf6ef;
  border-radius: 50%;
}

.photo {
  background-image: var(--pic);
  width: 175px;
  height: 175px;
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  border: 1px solid #707070;
  overflow: hidden;
}
</style>
