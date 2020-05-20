<template>
  <div>
    <b-button v-if="blob">Play/Pause</b-button>
    <b-button @click="record">Record</b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
// on record complete, $emit('input', audioBlob);

// play audio with Audio()   (HTMLAudioElement)

@Component
export default class classname extends Vue {
  temp: boolean = false;
  recording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  blob: Blob | null = null;

  async mounted() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);
  }

  record() {
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
