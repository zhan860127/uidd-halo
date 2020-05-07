<template>
  <div>
    <p id="t1">SIGN IN</p>
    <p id="t2">Use your Accout</p>
    <form id="form" action="/api/login" method="POST">
      <input
        id="user"
        class="input"
        type="text"
        name="username"
        placeholder="Username"
      />
      <input
        id="psd"
        class="input"
        type="password"
        name="password"
        placeholder="Password"
      />
      <input
        class="output"
        type="submit"
        value="DONE"
        onclick="log(); return false;"
      />
    </form>
    <div id="r"></div>
    <img id="i01" src="~/assets/img/1.png" onclick="history.back()" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class classname extends Vue {}
</script>

<style lang="sass">
@font-face
  font-family: 'Seravek'
  src: url('~assets/font/SeravekBasic.ttf') format("truetype")

body
  position: relative
  top: 0px
  left: 0
  width: 100vw
  min-width: 100px
  height: 177vw
  background: #FFFFFF 0% 0% no-repeat padding-box
  margin: 0px
  opacity: 1

#t1
  position: absolute
  top: 39.86vw
  left: 33.33vw
  width: 34.57vw
  height: 11.59vw
  text-align: left
  font-size: 9.66vw
  font-family: Seravek
  letter-spacing: 0px
  color: #4D6790
  opacity: 1
  margin: 0px

#t2
  position: absolute
  top: 51.45vw
  left: 32.61vw
  width: 36.02vw
  height: 7vw
  text-align: left
  font-family: Seravek
  font-size: 4.83vw
  letter-spacing: 0px
  color: #4D6790
  opacity: 1
  margin: 0px

.mes
  position: absolute
  text-align: center
  color: #4D6790
  font-family: Seravek
  font-size: 4.83vw
  top: 120.48vw
  left: 50%
  -webkit-transform: translate(-50%, -50%)

#i01
  position: absolute
  top: 168.60vw
  left: 91.06vw
  width: 6vw
  height: 6vw
  opacity: 1

.input
  border-radius: 30px
  width: 76.33vw
  font-size: 4.83vw
  height: 10.62vw
  padding: 4.83vw
  box-sizing: border-box
  font: Seravek
  background: #F5F4F4 0% 0% no-repeat padding-box
  border: 0px
.output
  border-radius: 30px
  position: absolute
  top: 100.48vw
  left: 11.83vw
  width: 76.32vw
  font-size: 4.83vw
  height: 10.62vw
  text-align: middle
  font-family: Seravek
  color: #FFFFFF
  background: #4D6790 0% 0% no-repeat padding-box
  border: 0px

::placeholder
  color: rgb(107, 143, 201)

#user
  position: absolute
  top: 65.46vw
  left: 11.83vw

#psd
  position: absolute
  top: 83.09vw
  left: 11.83vw
</style>
