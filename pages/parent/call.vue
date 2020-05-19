<template>
  <div>
    <b-button v-if="state === 'READY'" @click="call">
      Call
    </b-button>
    <b-button v-if="state === 'IN_CALL'" @click="hang"></b-button>
    <div>{{ state }}</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

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
}
</script>

<style></style>
