<template>
  <div class="root">
    <div class="wrapper">
      <div class="con">
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
            <input
              id="psd2"
              class="input"
              type="password"
              placeholder="Confirm"
            />
            <br />
            <input class="output" type="submit" value="DONE" />
          </form>
          <div id="r"></div>
          <img id="i01" src="~/assets/img/1.png" onclick="history.back()" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component
export default class classname extends Vue {
  mounted() {
    this.func();
  }

  func() {
    const vh = window.innerHeight * 0.01;
    (document.getElementsByClassName(
      'root'
    )[0] as HTMLInputElement).style.setProperty('--vh', `${vh}px`);
  }
}
</script>

<style lang="sass" scoped>
body
  position: relative
  top: 0px
  left: 0px
  width: 100%
  min-width: 100px
  height: 100%
  background: #FFFFFF 0% 0% no-repeat padding-box
  margin: 0px
  opacity: 1

.root
  height: 100vh
  height: calc(var(--vh, 1vh) * 100)
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
  top: 135px;
  left: 134px;
  width: 150px;
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
  top: 183px;
  left: 129px;
  width: 176px;
  height: 29px;
  text-align: left
  font-family: Seravek
  font-size: 20px
  letter-spacing: 0px
  color: #4D6790
  opacity: 1
  margin: 0px

#i01
  position: absolute
  bottom: 30px;
  left: 377px;
  width: 23px;
  height: 23px;
  opacity: 1

.input
  border-radius: 30px
  font-size: 20px
  width: 316px;
  height: 44px;
  padding: 20px
  font: Seravek
  background: #F5F4F4 0% 0% no-repeat padding-box
  border: 0px
.output
  border-radius: 30px
  position: absolute
  top: 531px;
  left: 49px;
  width: 316px;
  height: 44px;

  font-size: 20px

  text-align: middle
  font: Seravek
  color: #FFFFFF
  background: #4D6790 0% 0% no-repeat padding-box
  border: 0px

::placeholder
  color: rgb(107, 143, 201)

#email
  position: absolute
  top: 241px;
  left: 49px;

#user
  position: absolute
  top: 314px;
  left: 49px;

#psd
  position: absolute
  top: 386px;
  left: 49px;

#psd2
  position: absolute
  top: 459px;
  left: 49px;

.mes
  position: absolute
  text-align: center
  color: #4D6790
  font-family: Seravek
  font-size: 4.83vw
  top: 150.48vw
  left: 50%
  -webkit-transform: translate(-50%, -50%)

.con
  min-width: 300px
  width: 414px;
  height: 100%

@font-face
  font-family: 'Seravek'
  src: url('~assets/font/SeravekBasic.ttf') format("truetype")
</style>
