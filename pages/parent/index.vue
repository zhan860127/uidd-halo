<template>
  <div>
    <nuxt-link :to="{ path: '/parent/connect', query: { c: $route.query.c } }"
      >Link child's device</nuxt-link
    >
    <div class="wrapper">
      <div
        v-touch:swipe.left="left"
        v-touch:swipe.right="right"
        class="menu con"
      >
        <nuxt-link
          :to="{ path: '/parent/keywords', query: { c: $route.query.c } }"
          ><img ref="1" class="link p1" src="~/assets/img/m/1-11.png"
        /></nuxt-link>

        <nuxt-link :to="{ path: '/parent/logs', query: { c: $route.query.c } }"
          ><img ref="2" class="link p2" src="~/assets/img/m/1-02.png"
        /></nuxt-link>

        <nuxt-link :to="{ path: '/parent/call', query: { c: $route.query.c } }"
          ><img ref="3" class="link p3" src="~/assets/img/m/1-10.png"
        /></nuxt-link>

        <div id="contain" ref="4" class="link p4">
          <div id="name">{{ child.name }}</div>
          <nuxt-link :to="{ path: '/parent/children' }"
            ><img id="pic" src="~/assets/img/m/1-12.png"
          /></nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
  left() {
    console.log('left');
    const p1 = document.getElementsByClassName('p1')[0];
    const p2 = document.getElementsByClassName('p2')[0];
    const p3 = document.getElementsByClassName('p3')[0];
    const p4 = document.getElementsByClassName('p4')[0];

    setTimeout(function () {
      p1.classList.remove('p1');
      p2.classList.remove('p2');
      p3.classList.remove('p3');
      p4.classList.remove('p4');
      p1.classList.add('p2');
      p2.classList.add('p4');
      p3.classList.add('p1');
      p4.classList.add('p3');
    }, 100);
  }

  right() {
    console.log('left');
    const p1 = document.getElementsByClassName('p1')[0];
    const p2 = document.getElementsByClassName('p2')[0];
    const p3 = document.getElementsByClassName('p3')[0];
    const p4 = document.getElementsByClassName('p4')[0];

    setTimeout(function () {
      p1.classList.remove('p1');
      p2.classList.remove('p2');
      p3.classList.remove('p3');
      p4.classList.remove('p4');
      p1.classList.add('p3');
      p2.classList.add('p1');
      p3.classList.add('p4');
      p4.classList.add('p2');
    }, 100);
  }
}
</script>

<style scoped>
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
  width: 414px;
  height: 100%;
}
.menu {
  position: relative;
  display: flex;
  margin: 0px;

  height: 90vh;
  width: 500px;
}
.wrapper {
  max-width: 414px;
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
.p2 {
  z-index: 1;
  position: absolute;
  top: 48%;
  left: 25%;
  transition-duration: 1s;
}
.p3 {
  z-index: 1;
  position: absolute;
  top: 38%;
  left: 75%;
  transition-duration: 1s;
}
.p4 {
  z-index: 0;
  position: absolute;
  top: 28%;
  left: 40%;
  transition-duration: 1s;
}
</style>
