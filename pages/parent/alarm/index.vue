<template>
  <div>
    <nuxt-link :to="`/parent/alarm/add?c=${$route.query.c}`">Add</nuxt-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  layout: 'parent',
})
export default class AlarmPage extends Vue {}
</script>

<style></style>
