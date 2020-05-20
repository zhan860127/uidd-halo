<template>
  <div class="flex-grow-1 position-relative d-flex flex-column">
    <b-overlay :show="state === 'INIT'" class="d-flex flex-column flex-grow-1">
      <div class="flex-grow-1 d-flex flex-column">
        <div class="ready-msg" :class="{ hide: state !== 'READY' }">
          點選電話 <br />
          現在就與小寶貝通話吧！
        </div>
        <div
          v-if="state === 'READY' || state === 'CALL_REQUESTED'"
          class="flex-grow-1 d-flex flex-column align-items-center"
        >
          <div class="flex-grow-1"></div>
          <img
            src="/1-03 -2.png"
            alt="handset"
            class="handset"
            :class="{ picked: state === 'CALL_REQUESTED' }"
            @click="onHandsetClick"
          />
          <img src="/1-03 -1.png" alt="base" class="base" />
        </div>
        <div v-if="state === 'IN_CALL'" class="grid-root">
          <img src="/copy.png" class="portrait" />
          <div class="d-flex justify-content-center align-items-center">
            <img
              src="~/assets/img/hang_up.png"
              style="width: min(33vw, 120px);"
              alt="Hang up"
              @click="hang"
            />
          </div>
        </div>
      </div>

      <div
        v-if="state === 'CALL_FAILED' || state === 'CALL_INTERRUPTED'"
        class="error-box"
      >
        <div class="msg-title">OOPS!!</div>
        <div class="msg-body">
          未連結裝置，要<span style="color: #b51e41;">重新連線</span>嗎？
        </div>
        <div class="msg-btns">
          <nuxt-link :to="`/parent/connect?c=${$route.query.c}`" class="msg-btn"
            >YES</nuxt-link
          >
          <div class="msg-btn" @click="state = 'READY'">NO</div>
        </div>
      </div>
    </b-overlay>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator';

type State =
  | 'INIT'
  | 'READY'
  | 'CALL_REQUESTED'
  | 'IN_CALL'
  | 'HANGING'
  | 'CALL_FAILED'
  | 'CALL_INTERRUPTED';

@Component({
  layout: 'parent',
})
export default class classname extends Vue {
  audio: HTMLAudioElement | null = null;
  state: State = 'INIT';
  peer: any; // should be Peer
  peerCall: any; // should be Peer.MediaConnection

  @Watch('state')
  onStateChange(s: State) {
    console.log('STATE: ', s);
  }

  async mounted() {
    const Peer = (await import('peerjs')).default;
    const peer = new Peer({
      debug: 2,
    });
    this.peer = peer;
    peer.on('open', (id) => {
      console.log('myid: ', id);
      this.state = 'READY';
    });
    peer.on('connection', function (c) {
      // Disallow incoming connections
      c.on('open', function () {
        c.send('Sender does not accept incoming connections');
        setTimeout(function () {
          c.close();
        }, 500);
      });
    });
  }

  async call() {
    if (this.state !== 'READY') return;
    this.state = 'CALL_REQUESTED';
    let peerId: string;
    try {
      const { peerId: p } = await this.$axios.$post(
        `/call/${this.$route.query.c}`
      );
      peerId = p;
      console.log(`got peer id: ${peerId}`);
    } catch (_e) {
      this.state = 'CALL_FAILED';
      return;
    }
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    if (!localStream) {
      alert('Cannot get audio');
      this.state = 'READY';
      return;
    }
    console.log(`calling ${peerId}`);
    const call = this.peer.call(peerId, localStream);
    this.peerCall = call;
    call.on('stream', (remoteStream: MediaStream) => {
      console.log('got remote stream');
      const audio = new Audio();
      this.audio = audio;
      audio.srcObject = remoteStream;
      audio.play();
      this.state = 'IN_CALL';
    });
    call.on('close', () => {
      if (this.audio) this.audio.pause();
      if (this.state !== 'HANGING') {
        console.log('stream closed by remote');
        this.state = 'CALL_INTERRUPTED';
        return;
      } else {
        console.log('hanged up');
        this.state = 'READY';
      }
      console.log('stream closed');
    });
    call.on('error', (err: any) => {
      if (this.audio) this.audio.pause();
      console.error(err);
      this.state = 'CALL_INTERRUPTED';
    });
  }

  hang() {
    this.state = 'HANGING';
    this.peerCall.close();
  }

  onHandsetClick() {
    if (this.state === 'READY') {
      this.call();
    }
  }
}
</script>

<style lang="scss">
#parent-root {
  display: flex;
  flex-direction: column;
}

.abs-full {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
}

.base {
  width: 270px;
}

.handset {
  position: absolute;
  bottom: 170px;
  left: 50%;
  height: 270px;
  transform: translateX(-50%) rotate(90deg);
  transition: 500ms all ease-in-out;

  &.picked {
    left: 0;
    bottom: 250px;
    transform: none;
  }
}

.ready-msg {
  font-size: 20px;
  line-height: 27px;
  text-align: center;
  width: 100%;
  position: absolute;
  bottom: 440px;
  transition: opacity 100ms ease;
  &.hide {
    opacity: 0;
  }
}

.grid-root {
  display: grid;
  grid-template-rows: 8fr 5fr;
  flex-grow: 1;
}
.portrait {
  object-fit: contain;
  justify-self: stretch;
  align-self: stretch;
  object-position: 50% 50%;
}

.error-box {
  background-color: #fde9d2;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 34px;
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  left: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100px;
  padding: 20px;

  .msg-title {
    text-align: center;
    font: 25px/34px 'Avenir Book';
    margin-bottom: 11px;
  }

  .msg-body {
    text-align: center;
    font: 14px/20px 'Avenir Book';
  }

  .msg-btns {
    margin-top: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    .msg-btn {
      font: 13px/18px 'Avenir Book';
      background-color: #082448;
      border-radius: 14px;
      color: #fcf6ef;
      width: 50px;
      height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .msg-btn + .msg-btn {
      margin-left: 16px;
    }
  }
}
@media (min-width: 400px) {
  .error-box {
    width: 350px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
