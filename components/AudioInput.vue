<template>
  <div>
    <img
      v-if="!blob"
      id="pngRecord"
      src="../static/record1.png"
      @click="record"
    />
    <img
      v-if="blob"
      id="pngRecord"
      src="../static/record2.png"
      @click="record"
    />
    <div v-if="!isPaused && isTimerExisted" id="timer">
      {{ time() }}
    </div>
    <b-icon
      v-if="blob"
      id="play"
      class="btn-spacing"
      :icon="playing ? 'pause-fill' : 'play-fill'"
      @click="play"
    />
    <div v-if="isPaused && isTimerExisted && !summited" id="timer2">
      {{ time() }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
// on record complete, $emit('input', audioBlob);

function pad(input: number, width: number) {
  const z = '0';
  const n = input.toString();
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

@Component
export default class classname extends Vue {
  @Prop(Boolean) readonly clear: boolean = false;
  @Watch('clear')
  onClearChanged() {
    this.blob = null;
    this.summited = true;
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
  minute: number = 0;
  second: number = 0;
  isPaused: boolean = false;
  isTimerExisted: boolean = false;
  summited: boolean = false;

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

  time() {
    return `${pad(this.minute, 2)}:${pad(this.second, 2)}`;
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
      this.summited = false;
      if (!this.isTimerExisted) {
        const cancel = setInterval(() => {
          if (!this.isPaused) {
            this.second += 1;
            if (this.second === 60) {
              this.minute += 1;
              this.second = 0;
            }
          }
        }, 1000);
        if (this.second < 0) {
          // useless function for lint
          clearInterval(cancel);
        }
        this.isTimerExisted = true;
      } else if (this.isPaused) {
        this.second = 0;
        this.minute = 0;
        this.isPaused = false;
      }
    } else {
      this.mediaRecorder!.stop();
      this.recording = false;
      this.$emit('blobChange', true);
      this.isPaused = true;
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
  width: 26px;
  height: 26px;
  color: #fabf4d;
  padding: 3px;
  border-radius: 50%;
  background-color: #082448;
  position: absolute;
  right: 15%;
  top: 32%;
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
#timer {
  color: #082448;
  position: fixed;
  left: 50%;
  transform: translateX(-50%) translateY(-70px);
  font-size: 10px;
}
#timer2 {
  color: #082448;
  position: fixed;
  top: 110%;
  right: 15%;
  transform: translateX(-170%) translateY(-140px);
  font-size: 12px;
}
#pngRecord {
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
}
@media (max-width: 400px) {
  #play {
    width: 26px;
    height: 26px;
    color: #fabf4d;
    padding: 3px;
    border-radius: 50%;
    background-color: #082448;
    position: absolute;
    right: -7%;
    top: 32%;
  }
  #timer2 {
    color: #082448;
    position: fixed;
    top: 110%;
    right: -7%;
    transform: translateX(-170%) translateY(-140px);
    font-size: 12px;
  }
}
</style>
