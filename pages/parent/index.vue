<template>
  <div>
    Main page of child {{ child.name }} <br />
    Connect device with
    <a :href="`/api/connect/${child.token}`">this link </a>

    <br />
    功能主選單
    <br />
    <nuxt-link to="/parent/children">back</nuxt-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  async asyncData({ $axios, query, error }) {
    try {
      const child = await $axios.$get('/api/parent/child', {
        params: { id: query.c },
      });
      return { child };
    } catch (e) {
      error({ statusCode: 401 });
    }
  },
})
export default class classname extends Vue {}
</script>

<style></style>
