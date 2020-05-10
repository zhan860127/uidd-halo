<template>
  <div>
    Main page of child {{ child.name }} <br />
    Connect device with
    <a :href="`/api/connect/${child.token}`">this link </a>

    <ul>
      <li>
        <nuxt-link
          :to="{ path: '/parent/keywords', query: { c: $route.query.c } }"
          >關鍵字</nuxt-link
        >
      </li>
      <li>
        <nuxt-link :to="{ path: '/parent/logs', query: { c: $route.query.c } }"
          >說過的話</nuxt-link
        >
      </li>
      <li>
        <nuxt-link :to="{ path: '/parent/call', query: { c: $route.query.c } }"
          >通話</nuxt-link
        >
      </li>
      <li>
        <nuxt-link to="/parent/children">Choose Child</nuxt-link>
      </li>
    </ul>
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
  layout: 'parent',
})
export default class classname extends Vue {}
</script>

<style></style>
