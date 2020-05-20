<template>
  <div>
    <b-button v-if="blob">Play/Pause</b-button>
    <b-button>Record</b-button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
// import { Vue, Component, Prop } from 'vue-property-decorator';
// on record complete, $emit('input', audioBlob);

// play audio with Audio()   (HTMLAudioElement)

@Component
export default class classname extends Vue {
  blob: Blob | null = null;
}
</script>

<style></style>
