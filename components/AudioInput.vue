<template>
  <div>
    <b-button v-if="blob" @click="play">Play/Pause</b-button>
    <b-button @click="record">Record</b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
// on record complete, $emit('input', audioBlob);

@Component
export default class classname extends Vue {
  @Prop(Boolean) readonly clear: boolean = false;
  @Watch('clear')
  onClearChanged() {
    this.blob = null;
  }

  playing: boolean = false;
  recording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  audio: HTMLAudioElement | null = null;
  blob: Blob | null = null;

  async mounted() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
  }

  play() {
    if (!this.playing) {
      this.playing = true;
      this.audio = new Audio();
      const audioURL = window.URL.createObjectURL(this.blob);
      this.audio!.src = audioURL;
      this.audio!.play();
    } else {
      this.playing = false;
      this.audio!.pause();
    }

    this.audio!.onended = () => {
      this.playing = false;
    };
  }

  record() {
    this.blob = null;
    let chunks: Blob[] = [];
    if (!this.recording) {
      this.mediaRecorder!.start();
      this.recording = true;
    } else {
      this.mediaRecorder!.stop();
      this.recording = false;
    }

    this.mediaRecorder!.ondataavailable = (audio) => {
      chunks.push(audio.data);
    };

    this.mediaRecorder!.onstop = () => {
      this.blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      chunks = [];
      this.$emit('input', this.blob);
    };
  }
}
</script>

<style></style>
