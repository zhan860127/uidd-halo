<template>
  <div class="nav-ctn">
    <nuxt-link class="nav-item" :to="`/parent/logs?c=${$route.query.c}`">
      <b-icon-chat-dots />
    </nuxt-link>
    <nuxt-link :to="`/parent/keyword?c=${$route.query.c}`" class="nav-item"
      ><b-icon-mic
    /></nuxt-link>
    <nuxt-link :to="`/parent/alarm?c=${$route.query.c}`" class="nav-item"
      ><b-icon-alarm
    /></nuxt-link>
    <nuxt-link :to="`/parent/call?c=${$route.query.c}`" class="nav-item"
      ><b-icon-phone
    /></nuxt-link>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class Navbar extends Vue {}
</script>

<style lang="scss" scoped>
.nav-ctn {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  box-shadow: 0px 0px 5px #23181559;
  z-index: 0;
  background-color: white;
}

.nav-item {
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 36px;
  color: #082448;
  transition: 100ms ease-in all;
  padding: 20px 0;

  &:hover {
    background-color: #ddd;
  }
}
</style>
