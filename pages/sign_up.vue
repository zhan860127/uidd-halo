<template>
  <div>
    <p id="t1">SIGN UP</p>
    <p id="t2">Creat your Account</p>

    <form id="form" method="POST" action="/api/register">
      <input
        id="email"
        class="input"
        type="text"
        name="email"
        placeholder="Email"
      />
      <br />
      <input
        id="user"
        class="input"
        type="text"
        name="username"
        placeholder="Username"
      />
      <br />
      <input
        id="psd"
        class="input"
        type="password"
        name="password"
        placeholder="Password"
      />
      <br />
      <input id="psd2" class="input" type="password" placeholder="Confirm" />
      <br />
      <input class="output" type="submit" value="DONE" />
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
body
  position: relative
  top: 0px
  left: 0px
  width: 100vw
  min-width: 100px
  height: 177vw
  background: #FFFFFF 0% 0% no-repeat padding-box
  margin: 0px
  opacity: 1

#t1
  position: absolute
  top: 35.02vw
  left: 33.09vw
  width: 36.23vw
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
  top: 46.62vw
  left: 31.16vw
  width: 42.03vw
  height: 7vw
  text-align: left
  font-family: Seravek
  font-size: 4.83vw
  letter-spacing: 0px
  color: #4D6790
  opacity: 1
  margin: 0px

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
  font: Seravek
  background: #F5F4F4 0% 0% no-repeat padding-box
  border: 0px
.output
  border-radius: 30px
  position: absolute
  top: 130.68vw
  left: 11.83vw
  width: 76.32vw
  font-size: 4.83vw
  height: 10.62vw
  text-align: middle
  font: Seravek
  color: #FFFFFF
  background: #4D6790 0% 0% no-repeat padding-box
  border: 0px

::placeholder
  color: rgb(107, 143, 201)

#email
  position: absolute
  top: 60.63vw
  left: 11.83vw

#user
  position: absolute
  top: 78.26vw
  left: 11.83vw

#psd
  position: absolute
  top: 95.65vw
  left: 11.83vw

#psd2
  position: absolute
  top: 113.28vw
  left: 11.83vw

.mes
  position: absolute
  text-align: center
  color: #4D6790
  font-family: Seravek
  font-size: 4.83vw
  top: 150.48vw
  left: 50%
  -webkit-transform: translate(-50%, -50%)

@font-face
  font-family: 'Seravek'
  src: url('~assets/font/SeravekBasic.ttf') format("truetype")
</style>
