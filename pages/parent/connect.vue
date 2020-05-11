<template>
  <div>
    Instructions for linking the child's device
    <div>{{ url }}</div>
    <div style="width: 40vh;" v-html="qrSVG"></div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  async asyncData({ $axios, query }) {
    const { url, qrSVG } = await $axios.$get(`/api/parent/connect/${query.c}`);
    return { url, qrSVG };
  },
  layout: 'parent',
})
export default class classname extends Vue {}
</script>

<style></style>
