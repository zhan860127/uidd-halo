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
          :to="{ path: '/parent/keyword', query: { c: $route.query.c } }"
          ><img id="1" class="link p3" src="~/assets/img/m/1-11.png"
        /></nuxt-link>

        <nuxt-link :to="{ path: '/parent/logs', query: { c: $route.query.c } }"
          ><img id="2" class="link p1" src="~/assets/img/m/1-02.png"
        /></nuxt-link>

        <nuxt-link :to="{ path: '/parent/call', query: { c: $route.query.c } }"
          ><img id="3" class="link p2" src="~/assets/img/m/1-10.png"
        /></nuxt-link>
        <div id="contain" class="link p4">
          <div id="name">{{ child.name }}</div>
          <nuxt-link :to="{ path: '/parent/children' }"
            ><img id="pic" src="~/assets/img/m/1-12.png"
          /></nuxt-link>
        </div>
      </div>

      <div class="slidecontainer">
        <input
          id="myRange"
          type="range"
          min="0"
          max="3"
          value="0"
          class="slider"
          @input="change"
        />
        <div>
          <span id="d1" class="dot"></span>
          <span id="d2" class="dot"></span>
          <span id="d3" class="dot"></span>
          <span id="d4" class="dot"></span>
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

    const bar = (document.getElementById('myRange') as HTMLInputElement).value;

    if (bar === '3') {
      (document.getElementById('myRange') as HTMLInputElement).value = '0';
      (document.getElementById(
        'myRange'
      ) as HTMLInputElement).defaultValue = (document.getElementById(
        'myRange'
      ) as HTMLInputElement).value;
    } else {
      const x = parseInt(bar) + 1;
      (document.getElementById(
        'myRange'
      ) as HTMLInputElement).value = x.toString();
      (document.getElementById(
        'myRange'
      ) as HTMLInputElement).defaultValue = (document.getElementById(
        'myRange'
      ) as HTMLInputElement).value;
    }
  }

  right() {
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
    const bar = (document.getElementById('myRange') as HTMLInputElement).value;
    if (bar === '0') {
      (document.getElementById('myRange') as HTMLInputElement).value = '3';
      (document.getElementById(
        'myRange'
      ) as HTMLInputElement).defaultValue = (document.getElementById(
        'myRange'
      ) as HTMLInputElement).value;
    } else {
      const x = parseInt(bar) - 1;
      (document.getElementById(
        'myRange'
      ) as HTMLInputElement).value = x.toString();
      (document.getElementById(
        'myRange'
      ) as HTMLInputElement).defaultValue = (document.getElementById(
        'myRange'
      ) as HTMLInputElement).value;
    }
  }

  change() {
    const bar = (document.getElementById('myRange') as HTMLInputElement).value;
    const bar2 = (document.getElementById('myRange') as HTMLInputElement)
      .defaultValue;
    (document.getElementById('myRange') as HTMLInputElement).defaultValue = bar;
    const p1 = document.getElementsByClassName('p1')[0];
    const p2 = document.getElementsByClassName('p2')[0];
    const p3 = document.getElementsByClassName('p3')[0];
    const p4 = document.getElementsByClassName('p4')[0];
    if (bar > bar2) {
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
    if (bar < bar2) {
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
.slidecontainer {
  position: absolute;
  width: 18%;
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
  display: inline-block;
  position: relative;
}
#d1 {
  background: #b51e41 0% 0% no-repeat padding-box;
  opacity: 1;
  left: 0px;
  bottom: 6%;
}
#d2 {
  background: #fabf4d 0% 0% no-repeat padding-box;
  opacity: 1;
  left: 9.5px;
  bottom: 6%;
}
#d3 {
  background: #fde9d2 0% 0% no-repeat padding-box;
  opacity: 1;
  left: 19px;
  bottom: 6%;
}
#d4 {
  background: #082448 0% 0% no-repeat padding-box;
  opacity: 1;
  left: 28.5px;
  bottom: 6%;
}
</style>
