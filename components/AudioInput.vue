<template>
  <div>
    <b-button v-if="blob">Play/Pause</b-button>
    <b-button @click="record">Record</b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
// import { Vue, Component, Prop } from 'vue-property-decorator';
// on record complete, $emit('input', audioBlob);

// play audio with Audio()   (HTMLAudioElement)

@Component
export default class classname extends Vue {
  recording: boolean = false;
  blob: Blob | null = null;

  async mounted() {}

  async record() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream as MediaStream);
    if (!this.recording) {
      mediaRecorder.start();
      this.recording = true;
    } else {
      mediaRecorder.stop();
      this.recording = false;
    }

    mediaRecorder.onstop = function () {};
  }
}
</script>

<style></style>
