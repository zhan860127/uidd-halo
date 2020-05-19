<template>
  <div>
    <b-button @click="call">
      Call
    </b-button>
    <audio controls :src-object.prop.camel="remoteStream"></audio>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  layout: 'parent',
})
export default class classname extends Vue {
  remoteStream: MediaStream | null = null;
  peer: any; // should be Peer

  async mounted() {
    const Peer = (await import('peerjs')).default;
    const peer = new Peer({
      debug: 2,
    });
    this.peer = peer;
    peer.on('open', (id) => {
      console.log('myid: ', id);
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
    let peerId: string;
    try {
      const { peerId: p } = await this.$axios.$post(
        `/call/${this.$route.query.c}`
      );
      peerId = p;
      console.log(`got peer id: ${peerId}`);
    } catch (_e) {
      throw new Error('cannot get peer id');
    }
    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    if (!localStream) {
      throw new Error('cannot get local audio stream');
    }
    console.log(`calling ${peerId}`);
    const call = this.peer.call(peerId, localStream);
    call.on('stream', (remoteStream: MediaStream) => {
      console.log('got remote stream');
      this.remoteStream = remoteStream;
    });
    call.on('close', () => {
      console.log('stream closed');
      this.remoteStream = null;
    });
    call.on('error', (err: any) => {
      console.error(err);
      this.remoteStream = null;
    });
  }
}
/*
.on('call_ok', peerId => {
        console.log(`child ready to connect with peer id ${peerId}`);
      }).on('call_fail', () => {
        console.log('')
      });
*/
</script>

<style></style>
