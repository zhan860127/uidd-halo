<template>
  <b-container>
    <div class="wrapper">
      <div style="width: 50%;" v-html="qrSVG"></div>
      <input
        ref="input"
        class="linkbox"
        type="text"
        :value="url"
        @change.prevent
      />
      <div class="share" @click="share">Share</div>
    </div>
    <b-toast id="toast">Link copied to clipboard!</b-toast>
  </b-container>
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'vue-property-decorator';
import '~/assets/scss/_fonts.scss';

type ShareData = {
  title?: string;
  text?: string;
  url?: string;
};

interface Navigator {
  share?: (data?: ShareData) => Promise<void>;
}

@Component({
  async asyncData({ $axios, query }) {
    const { url, qrSVG } = await $axios.$get(`/api/parent/connect/${query.c}`);
    return { url, qrSVG };
  },
  layout: 'parent',
})
export default class classname extends Vue {
  url?: string;
  share() {
    if (window.navigator.share) {
      window.navigator
        .share({
          title: 'HALO',
          text: '',
          url: this.url,
        })
        .catch();
    } else {
      this.input.select();
      document.execCommand('copy');
      this.$bvToast.toast('Link copied to clipboard!', {
        toaster: 'b-toaster-bottom-center',
        title: 'Success',
        autoHideDelay: 1000,
      });
    }
  }

  @Ref('input') input!: HTMLInputElement;
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px);
}

.linkbox {
  background-color: #fde9d2;
  padding: 7px;
  border-radius: 7px;
  color: #082448;
  font: 15px/20px 'Avenir Book';
  width: 70%;
  border: none;
  text-align: center;
}

.share {
  margin-top: 50px;
  background-color: #082448;
  color: #fcf6ef;
  font: 17px/23px 'Avenir Book';
  padding: 5px 10px;
}
</style>
