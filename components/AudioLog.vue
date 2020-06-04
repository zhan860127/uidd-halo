<template>
  <AudioPlayer :path="path" :transcript="audio.transcript">
    <template v-slot:center>
      <div class="flex-grow-1 align-self-center mx-2"></div>
      <div class="audio-time">{{ time }}</div>
    </template>
    <template v-slot:right>
      <b-dropdown
        size="lg"
        variant="link"
        toggle-class="text-decoration-none"
        no-caret
        right
        class="menu-dropdown"
      >
        <template v-slot:button-content>
          <b-icon-three-dots-vertical style="color: #082448;" />
        </template>
        <b-dropdown-item @click="$emit('edit-audio', audio)"
          >編輯</b-dropdown-item
        >
        <b-dropdown-item @click="$emit('delete-audio', audio)"
          >刪除</b-dropdown-item
        >
      </b-dropdown>
    </template>
  </AudioPlayer>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import dayjs from 'dayjs';
import { AudioData } from '../assets/ts/AudioData';
import AudioPlayer from '~/components/AudioPlayer.vue';

import '~/assets/scss/_fonts.scss';

const audioPath = (id: number) => `/api/parent/audiofile/${id}`;

@Component({ components: { AudioPlayer } })
export default class classname extends Vue {
  @Prop({ default: {} }) readonly audio!: AudioData;
  get time(): string {
    return dayjs(this.audio.date).format('HH:mm');
  }

  get path(): string {
    return audioPath(this.audio.id);
  }
}
</script>

<style lang="scss" scoped>
.audio-time {
  font: 9px/11px HelveticaNeue;
  color: #082448;
}

::v-deep .menu-dropdown > button {
  padding: 0;
}
</style>
