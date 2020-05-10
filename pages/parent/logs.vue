<template>
  <div>
    <div>歷史紀錄</div>
    <div>
      <AudioLog v-for="audio in audios" :key="audio.id" :audio="audio" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import AudioLog from '~/components/AudioLog.vue';

@Component({
  components: {
    AudioLog,
  },
  layout: 'parent',
  async asyncData({ $axios, query }) {
    const audios = await $axios.$get('/api/parent/child_audio', {
      params: { c: query.c },
    });
    return { audios };
  },
})
export default class classname extends Vue {}
</script>

<style></style>
