<template>
  <div id="root">
    <div id="top">
      <div class="wrapper">
        <div id="top-content">
          <img id="he" src="~/assets/img/2.png" />
          <div id="w">Welcome</div>
          <div id="wc">
            Parental companionship is the best gift in the child's growth
          </div>
        </div>
      </div>
    </div>
    <div id="bottom">
      <div class="wrapper">
        <a href="/sign_up" class="button text-decoration-none">SIGN UP</a>
        <a href="/sign_in" class="button text-decoration-none">SIGN IN</a>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({});
</script>

<style scoped>
* {
  box-sizing: border-box;
}
body,
html {
  margin: 0;
  padding: 0;
}
.wrapper {
  max-width: 500px;
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
#top {
  background: #fcf6ef;
  flex-grow: 7;
}
#bottom {
  background: #fff;
  flex-grow: 3;
}
#he {
  width: 60px;
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
@font-face {
  font-family: 'Seravek';
  src: url('~assets/font/Seravek.ttf') format('truetype');
}
@font-face {
  font-family: 'HelveticaNeue';
  src: url('~assets/font/HelveticaNeueRegular.ttf') format('truetype');
}
</style>
