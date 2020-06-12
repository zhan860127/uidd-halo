<template>
  <div id="root">
    <div class="a" @click="skip()">
      <transition name="fade">
        <img v-if="!show3" class="pr2" src="~/assets/img/m/1-01.png" />
      </transition>
      <transition name="slide-fade2">
        <img v-if="show4" class="pr" src="~/assets/img/m/1-01.gif" />
      </transition>
      <img class="he1 he2" src="~/assets/img/2.png" />
      <transition name="bounce">
        <img v-if="show" class="m1" src="~/assets/img/m/1-07.png" />
      </transition>
      <transition name="bounce">
        <img v-if="show2" class="m2" src="~/assets/img/m/1-08.png" />
      </transition>
      <transition name="slide-fade">
        <img v-if="show4" class="ch" src="~/assets/img/m/1-13.gif" />
      </transition>
      <transition name="fade">
        <img v-if="!show3" class="ch2" src="~/assets/img/m/1-13.png" />
      </transition>
    </div>
    <div id="top">
      <div class="wrapper">
        <div id="top-content">
          <img class="he" src="~/assets/img/2.png" />
          <div id="w">Welcome</div>
          <div id="wc">
            Parental companionship is the best gift in the child's growth
          </div>
        </div>
      </div>
    </div>
    <div class="bottom bottom2">
      <div class="wrapper">
        <a href="/sign_up" class="button text-decoration-none">SIGN UP</a>
        <a href="/sign_in" class="button text-decoration-none">SIGN IN</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'App',
  data() {
    return {
      show: false,
      show2: false,
      show3: true,
      show4: false,
    };
  },
  mounted() {
    this.start();
  },
  methods: {
    start() {
      setTimeout(() => {
        this.show4 = !this.show4;
      }, 300);
      setTimeout(() => {
        this.show = !this.show;
      }, 1000);
      setTimeout(() => {
        this.show = !this.show;
      }, 2000);
      setTimeout(() => {
        this.show2 = !this.show2;
      }, 3200);
      setTimeout(() => {
        this.show2 = !this.show2;
      }, 4400);
      setTimeout(() => {
        this.show4 = !this.show4;
      }, 4900);
      setTimeout(() => {
        this.show3 = !this.show3;
      }, 5300);
      setTimeout(function () {
        (document.getElementsByClassName(
          'ch2'
        )[0] as HTMLInputElement).style.left = '50%';
      }, 5600);
      setTimeout(function () {
        (document.getElementsByClassName(
          'pr2'
        )[0] as HTMLInputElement).style.left = '53%';
      }, 5600);
      setTimeout(() => {
        this.show3 = !this.show3;
      }, 6400);
      setTimeout(function () {
        (document.getElementsByClassName(
          'he2'
        )[0] as HTMLInputElement).style.opacity = '1';
      }, 6400);
      setTimeout(function () {
        (document.getElementsByClassName(
          'he2'
        )[0] as HTMLInputElement).classList.remove('he2');
      }, 7100);
      setTimeout(function () {
        (document.getElementsByClassName(
          'he1'
        )[0] as HTMLInputElement).style.opacity = '0';
      }, 8600);
      setTimeout(function () {
        (document.getElementsByClassName(
          'a'
        )[0] as HTMLInputElement).style.opacity = '0';
      }, 8600);
      setTimeout(function () {
        (document.getElementsByClassName(
          'bottom2'
        )[0] as HTMLInputElement).classList.remove('bottom2');
      }, 8600);
      setTimeout(function () {
        (document.getElementsByClassName(
          'a'
        )[0] as HTMLInputElement).classList.add('hide');
      }, 9900);
    },
    skip() {
      document.getElementsByClassName('bottom2')[0].classList.remove('bottom2');
      document.getElementsByClassName('a')[0].classList.add('hide');
    },
  },
});
</script>

<style>
* {
  box-sizing: border-box;
}
body,
html {
  margin: 0;
  padding: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.hide {
  display: none;
}
.wrapper {
  max-width: 420px;
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
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.a {
  position: absolute;
  transform: translate(-50%, -50%);
  background: #fcf6ef;
  width: 500px;
  height: 100%;
  left: 50%;
  top: 50%;
  z-index: 3;
  overflow: hidden;
  opacity: 1;
  transition: 1500ms;
}
.pr {
  position: absolute;
  height: 45%;
  top: 0px;
  left: -30px;
  z-index: 5;
}

.ch2 {
  position: absolute;
  transform: translate(-50%, -50%);
  height: 45%;
  top: 50%;
  left: 490px;
  z-index: 5;
  object-fit: contain;
  transition: 800ms;
}
.pr2 {
  position: absolute;
  transform: translate(-50%, -50%) scale(1, -1);
  height: 45%;
  top: 50%;
  left: 25px;
  z-index: 6;
  transition: 800ms;
}
.m1 {
  position: absolute;
  width: 250px;
  height: 15%;
  top: 50%;
  left: 110px;
  z-index: 6;
}
.m2 {
  position: absolute;
  width: 261px;
  height: 7.5%;
  top: 44%;
  left: 150px;
  z-index: 6;
}
.ch {
  position: absolute;
  height: 45%;
  bottom: 0px;
  right: -40px;
  z-index: 5;
  object-fit: contain;
}
#top {
  background: #fcf6ef;
  flex-grow: 7;
}
.bottom {
  background: #fff;
  flex-grow: 3;
  transition: 1500ms;
}
.bottom.bottom2 {
  background: #fcf6ef;
  flex-grow: 3;
}
.he {
  width: 60px;
}
.he1 {
  width: 60px;
  z-index: 3;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 26%;
  transition: 1500ms;
  left: 50%;
}
.he1.he2 {
  width: 120px;
  top: 50%;
  opacity: 0;
}
#w {
  margin-top: 52px;
  font-size: 40px;
  font-family: Seravek;
  color: #082448;
}

#wc {
  margin-top: 20px;
  font-size: 15px;
  color: #082448;
  font-family: HelveticaNeue;
}
#top-content {
  text-align: center;
}
#root {
  height: 100vh;
  min-height: 450px;
  display: flex;
  flex-direction: column;
}
.v-center {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
.button {
  font: normal 20px/25px Seravek;
  color: #4d6790;
  background: #fff;
  width: 113px;
  text-align: center;
  border-radius: 1em;
  padding-top: 0.3em;
  padding-bottom: 0.3em;
  transition: all 200ms ease;
  cursor: pointer;
}
.button + .button {
  margin-top: 5px;
}
.button:hover {
  background: #4d6790;
  color: #fff;
}
.no-dec {
  text-decoration: none;
}
.slide-fade-enter-active,
.slide-fade2-enter-active {
  transition: all 0.5s ease;
}
.slide-fade-leave-active,
.slide-fade2-leave-active {
  transition: 0.5s cubic-bezier(0.49, -0.55, 0.34, 1.04);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(100px) translateX(0px);
  opacity: 0;
}
.slide-fade2-enter,
.slide-fade2-leave-to {
  transform: translateY(-100px) translateX(0px);
  opacity: 0;
}
@font-face {
  font-family: 'Seravek';
  src: url('~assets/font/Seravek.ttf') format('truetype');
}
@font-face {
  font-family: 'HelveticaNeue';
  src: url('~assets/font/HelveticaNeueRegular.ttf') format('truetype');
}
</style>
