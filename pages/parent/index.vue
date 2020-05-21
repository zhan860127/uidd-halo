<template>
  <div>
    <div class="wrapper">
      <div
        v-touch:swipe.left="left"
        v-touch:swipe.right="right"
        class="menu con"
      >
        <a :href="`/parent/keyword?c=${$route.query.c}`"
          ><img
            id="1"
            :class="`link p${((2 + (4 - offset + 3)) % 4) + 1}`"
            src="~/assets/img/m/1-11.png"
        /></a>

        <a :href="`/parent/logs?c=${$route.query.c}`"
          ><img
            id="2"
            :class="`link p${((1 + (4 - offset + 3)) % 4) + 1}`"
            src="~/assets/img/m/1-02.png"
        /></a>

        <a :href="`/parent/call?c=${$route.query.c}`"
          ><img
            id="3"
            :class="`link p${((4 - offset + 3) % 4) + 1}`"
            src="~/assets/img/m/1-10.png"
        /></a>
        <div id="contain" :class="`link p${((3 + (4 - offset + 3)) % 4) + 1}`">
          <div id="name">{{ child.name }}</div>
          <a href="/parent/children"
            ><img id="pic" src="~/assets/img/m/1-12.png"
          /></a>
        </div>
      </div>
      <div class="slidecontainer">
        <input
          id="myRange"
          v-model.number="offset"
          type="range"
          min="0"
          max="3"
          value="0"
          class="slider"
        />
        <div class="d-flex justify-content-between align-items-center mt-2">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// TODO: replace <a> with <nuxt-link>
// nuxt-link's content doesn't change reactively for some reason

import { Vue, Component } from 'vue-property-decorator';
import Vue2 from 'vue';
import Vue2TouchEvents from 'vue2-touch-events';

Vue2.use(Vue2TouchEvents, {
  disableClick: false,
  touchClass: '',
  tapTolerance: 10,
  touchHoldTolerance: 400,
  swipeTolerance: 30,
  longTapTimeInterval: 400,
});
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
  watchQuery: true,
  layout: 'parent',
})
export default class menu extends Vue {
  offset: number = 0;
  left() {
    this.offset = (this.offset + 1) % 4;
  }

  right() {
    this.offset = (this.offset + 3) % 4;
  }
}
</script>

<style lang="scss" scoped>
.link {
  transform: translate(-50%, -50%);
  max-height: 300px;
  max-width: 220px;
}
body {
  margin: 0%;
  padding: 0%;
}
.con {
  min-width: 300px;
  height: 100%;
}
.menu {
  position: relative;
  display: flex;
  margin: 0px;

  height: 90vh;
}
.wrapper {
  margin: 0 auto;
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-left: 58px;
  padding-right: 58px;
}
#contain {
  position: relative;
  width: 250px;
}
#name {
  position: absolute;
  bottom: 47%;
  left: 20%;
  font-size: 30px;
  z-index: 1;
}
#pic {
  position: absolute;
  max-height: 300px;
  max-width: 220px;
}
.p1 {
  z-index: 2;
  position: absolute;
  top: 63%;
  left: 55%;
  transition-duration: 1s;
}
.p4 {
  z-index: 1;
  position: absolute;
  top: 48%;
  left: 25%;
  transition-duration: 1s;
}
.p2 {
  z-index: 1;
  position: absolute;
  top: 38%;
  left: 75%;
  transition-duration: 1s;
}
.p3 {
  z-index: 0;
  position: absolute;
  top: 28%;
  left: 40%;
  transition-duration: 1s;
}
.slidecontainer {
  position: absolute;
  width: 75px;
  height: 10px;
  bottom: 8%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 3px;
  border: 0px solid #707070;
  opacity: 0.7;
  background: #707070;
}
.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background: #707070;
  cursor: pointer;
}
.dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;

  &:nth-child(1) {
    background-color: #b51e41;
  }
  &:nth-child(2) {
    background-color: #fabf4d;
  }
  &:nth-child(3) {
    background-color: #fde9d2;
  }
  &:nth-child(4) {
    background-color: #082448;
  }
}
</style>
