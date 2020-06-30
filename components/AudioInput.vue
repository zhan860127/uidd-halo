<template>
  <div>
    <b-icon
      v-if="!blob"
      id="record"
      :class="{ recording: recording }"
      icon="mic-fill"
      @click="record"
    />
    <div v-if="blob" class="play-record">
      <b-icon
        id="play"
        class="btn-spacing"
        :icon="playing ? 'pause-fill' : 'play-fill'"
        @click="play"
      />
      <b-icon
        id="record2"
        class="btn-spacing"
        icon="mic-fill"
        @click="record"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
// on record complete, $emit('input', audioBlob);

@Component
export default class classname extends Vue {
  @Prop(Boolean) readonly clear: boolean = false;
  @Watch('clear')
  onClearChanged() {
    this.blob = null;
  }

  @Prop() readonly editBlob: Blob | null = null;
  @Watch('editBlob')
  onBlobChanged() {
    this.blob = this.$props.editBlob;
  }

  playing: boolean = false;
  recording: boolean = false;
  mediaRecorder: MediaRecorder | null = null;
  audio: HTMLAudioElement | null = null;
  blob: Blob | null = null;

  play() {
    if (!this.playing) {
      this.playing = true;
      this.audio = new Audio();
      const audioURL = window.URL.createObjectURL(this.blob);
      this.audio!.src = audioURL;
      this.audio!.play();
    } else {
      this.playing = false;
      this.audio!.pause();
    }

    this.audio!.onended = () => {
      this.playing = false;
    };
  }

  async record() {
    this.blob = null;
    let chunks: Blob[] = [];
    if (!this.mediaRecorder) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
    }
    if (!this.recording) {
      this.mediaRecorder!.start();
      this.recording = true;
    } else {
      this.mediaRecorder!.stop();
      this.recording = false;
      this.$emit('blobChange', true);
    }

    this.mediaRecorder!.ondataavailable = (audio) => {
      chunks.push(audio.data);
    };

    this.mediaRecorder!.onstop = () => {
      this.blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      chunks = [];
      this.$emit('input', this.blob);
    };
  }
}
</script>

<style>
#record {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 122px;
  height: 122px;
  padding: 30px;
  color: #082448;
  border-radius: 50%;
  background-color: #fde9d2;
}
#record :hover {
  cursor: pointer;
}
.play-record {
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
#record2 {
  width: 75px;
  height: 75px;
  color: #fde9d2;
  border-radius: 50%;
  padding: 18px;
  background-color: #b51e41;
}
#record2 :hover {
  cursor: pointer;
}
#play {
  width: 75px;
  height: 75px;
  color: #fabf4d;
  padding: 14px;
  border-radius: 50%;
  background-color: #082448;
}
#play :hover {
  cursor: pointer;
}
.btn-spacing {
  margin: 0px 50px;
}
.recording {
  border-radius: 50%;
  box-shadow: 0 0 0 3px #082448;
}
</style>
