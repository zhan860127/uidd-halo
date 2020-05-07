<template>
  <div>
    Child's main page <br />
    Sends audio to server
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({})
export default class classname extends Vue {
  recordedChunks = [];
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
