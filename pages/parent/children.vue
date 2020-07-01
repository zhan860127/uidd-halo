<template>
  <div class="picker-root">
    <div class="top-bar">{{ !step ? '選擇裝置' : '新增裝置' }}</div>
    <b-overlay :show="loading">
      <template v-if="step === 0">
        <div class="statuses container">
          <div class="row">
            <nuxt-link
              v-for="child in childStatus"
              :key="child.id"
              class="col-4 sidebar-item plain pointer"
              :to="`/parent/logs?c=${child.id}`"
              ><ChildStatus
                size="60px"
                :child-id="child.id"
                :online="child.online"
            /></nuxt-link>
          </div>
        </div>
        <div class="picker-plus">
          <b-icon-plus-circle @click="step = 1" />
        </div>
      </template>
      <template v-if="step === 1">
        <div style="text-align: center; margin-top: 90px; font-size: 15px;">
          STEP 1
        </div>
        <div style="text-align: center; font-size: 20px; margin-bottom: 55px;">
          選擇性別
        </div>
        <div style="display: flex; justify-content: center;">
          <img
            ref="girl"
            :src="`/girl-o${isGirl ? 'n' : 'ff'}.png`"
            class="portrait"
            @click="isGirl = true"
          />
          <img
            ref="boy"
            :src="`/boy-o${!isGirl ? 'n' : 'ff'}.png`"
            class="portrait"
            @click="isGirl = false"
          />
        </div>
        <div class="boygirl-cursor-ctn">
          <div class="boygirl-cursor" :style="{ left: cursorLeft }"></div>
        </div>
        <OKButton style="margin: 85px auto 5px;" @click="step = 2" />
      </template>
      <template v-if="step === 2">
        <div style="text-align: center; margin-top: 90px; font-size: 15px;">
          STEP 2
        </div>
        <div style="text-align: center; font-size: 20px; margin-bottom: 55px;">
          選擇照片及設計裝置名稱
        </div>
        <ImgInput v-model="imgSrc" style="margin: 0 auto 50px;" />
        <div class="name-input-ctn">
          <label id="name-label" for="name-input">裝置名稱</label>
          <input id="name-input" v-model="name" />
        </div>
        <OKButton
          v-if="imgSrc && name"
          style="margin: 25px auto 5px;"
          @click="send"
      /></template>
    </b-overlay>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import io from 'socket.io-client';
import ChildStatus from '~/components/ChildStatus.vue';
import OKButton from '~/components/OKButton.vue';
import ImgInput from '~/components/ImgInput.vue';

@Component({
  async asyncData({ $axios }) {
    const children = await $axios.$get('/api/parent/children');
    return { children };
  },
  components: { ChildStatus, OKButton, ImgInput },
})
export default class classname extends Vue {
  step: number = 0;
  isGirl: boolean = true;
  imgSrc: string = '';
  name: string = '';
  loading: boolean = false;

  @Ref('girl') girl!: HTMLImageElement;
  @Ref('boy') boy!: HTMLImageElement;

  cursorLeft: string = '50%';

  created() {
    io.connect('/parent').on('status', (v: any) => {
      this.$store.commit('parent/setChildStatus', v);
    });
  }

  setCursor() {
    const sel = this.isGirl ? this.girl : this.boy;
    if (!sel) return;
    const r = sel.getBoundingClientRect();
    this.cursorLeft = `${(r.left + r.right) / 2}px`;
  }

  mounted() {
    this.setCursor();
  }

  @Watch('isGirl') onGender() {
    this.setCursor();
    setTimeout(() => this.setCursor(), 50);
  }

  @Watch('step') onStep(step: number) {
    if (step !== 1) return;
    this.setCursor();
    setTimeout(() => this.setCursor(), 50);
    setTimeout(() => this.setCursor(), 200);
    setTimeout(() => this.setCursor(), 300);
  }

  get childStatus(): any {
    return this.$store.state.parent.childStatus;
  }

  async send() {
    const fd = new FormData();
    const blob = await fetch(this.imgSrc).then((res) => res.blob());
    fd.append('img', blob);
    fd.append('name', this.name);
    this.loading = true;
    const res = await this.$axios({
      url: '/api/parent/add_child',
      method: 'post',
      data: fd,
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    if (res.data.url) window.location.href = res.data.url;
  }
}
</script>

<style lang="scss" scoped>
.statuses {
  margin: 160px auto 50px;
  width: 215px;
}

.picker-root {
  height: 100vh;
  background-color: #fcf6ef;
  display: grid;
  grid-template-rows: min-content 1fr;
  & > :nth-child(2) {
    overflow-y: auto;
  }
}

.picker-plus {
  font-size: 45px;
  text-align: center;
  margin-bottom: 20px;
}

.top-bar {
  color: #fcf6ef;
  background-color: #082448;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 73px;
}

.portrait {
  height: 200px;
  width: auto;
}

.boygirl-cursor-ctn {
  margin-top: 25px;
}

.boygirl-cursor {
  width: 0;
  height: 0;
  border-left: 7.5px solid transparent;
  border-right: 7.5px solid transparent;
  border-bottom: 13px solid #082448;
  transition: all 100ms ease-out;
  position: relative;
  transform: translateX(-50%);
  left: 50%;
}

.name-input-ctn {
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 19px;
  width: 221px;
  padding: 19px;
  display: flex;
  margin: 0 auto;
}

#name-label {
  background-color: #fde9d2;
  display: block;
  border-radius: 7px;
  padding: 3px 6px;
}

#name-input {
  display: block;
  flex-grow: 1;
  width: 0;
  &,
  &:active,
  &:focus {
    border: none;
    border-bottom: 1px solid #707070;
  }
  padding-left: 0.3em;
}
</style>
