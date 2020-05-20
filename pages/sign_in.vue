<template>
  <div id="root">
    <div class="wrapper">
      <div class="con">
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
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class classname extends Vue {}
</script>

<style lang="sass" scoped>
@font-face
  font-family: 'Seravek'
  src: url('~assets/font/SeravekBasic.ttf') format("truetype")

body
  position: relative
  top: 0px
  left: 0
  width: 100%
  min-width: 100px
  height: 100%
  background: #FFFFFF 0% 0% no-repeat padding-box
  margin: 0px
  opacity: 1




#root
  height: 100vh
  min-height: 450px
  display: flex
  flex-direction: column

.wrapper
  max-width: 414px
  margin: 0 auto
  position: relative
  height: 100%
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  padding-left: 58px
  padding-right: 58px

#t1
  position: absolute
  top: 165px;
  left: 138px;
  width: 146px;
  height: 48px;
  text-align: left
  font-size: 40px
  font-family: Seravek
  letter-spacing: 0px
  color: #4D6790
  opacity: 1
  margin: 0px

#t2
  position: absolute
  top: 213px;
  left: 135px;
  width: 157px;
  height: 29px;
  text-align: left
  font-family: Seravek
  font-size: 20px
  letter-spacing: 0px
  color: #4D6790
  opacity: 1
  margin: 0px

.mes
  position: absolute
  text-align: center
  color: #4D6790
  font-family: Seravek
  font-size: 4.83%
  top: 120.48%
  left: 50%
  -webkit-transform: translate(-50%, -50%)

#i01
  position: absolute
  bottom: 41px;
  left: 377px;
  width: 23px;
  height: 23px;
  opacity: 1

.input
  border-radius: 30px
  width: 316px;
  height: 44px;
  font-size: 20px
  padding: 4.83%
  box-sizing: border-box
  font: Seravek
  background: #F5F4F4 0% 0% no-repeat padding-box
  border: 0px
.output
  border-radius: 30px
  position: absolute
  top: 416px;
  left: 49px;
  width: 316px;
  height: 44px;
  font-size: 20px
  text-align: middle
  font-family: Seravek
  color: #FFFFFF
  background: #4D6790 0% 0% no-repeat padding-box
  border: 0px

::placeholder
  color: rgb(107, 143, 201)

#user
  position: absolute
  top: 271px;
  left: 49px;


#psd
  position: absolute
  top: 344px;
  left: 49px;

.con
  min-width: 300px
  width: 414px;
  height: 100%
</style>
