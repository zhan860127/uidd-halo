const silenceMs = 250;
const nonSilenceMs = 300;
const msInFrame = 100;
const silenceFrame = silenceMs / msInFrame;
const nonSilenceFrame = nonSilenceMs / msInFrame;

const thresholdVolume = 0.5;

export default class SpeechRecorder {
  onSpeechEnd: (blob: Blob) => void = () => {};
  onStarted: () => void = () => {};
  mediaRecorder?: MediaRecorder;
  #analyzer?: AnalyserNode;
  state: 'idle' | 'started' = 'idle';

  async start() {
    if (this.state === 'started') return;
    this.state = 'started';
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    console.log('recorder started');
    this.onStarted();
    this.onGotStream(stream);
  }

  stop() {
    console.log('recorder stopped');
    this.state = 'idle';
    this.mediaRecorder!.stop();
  }

  toggle() {
    if (this.state === 'idle') this.start();
    else this.stop();
  }

  getVolume(): number {
    // normalized volume in 0-1
    const arr = new Float32Array(this.#analyzer!.fftSize);
    this.#analyzer!.getFloatTimeDomainData(arr);
    const p = arr.map((x) => x ** 2).reduce((a, b) => a + b) / arr.length;
    const vol = (32 + Math.log2(p)) / 32;
    return Number.isNaN(vol) ? 0 : Math.max(0, vol);
  }

  private onGotStream(stream: MediaStream) {
    const recordedChunks: Blob[] = [];
    this.mediaRecorder = new MediaRecorder(stream);
    const ctx = new window.AudioContext();
    const analyzer = ctx.createAnalyser();
    const srcNode = ctx.createMediaStreamSource(stream);
    srcNode.connect(analyzer);
    this.#analyzer = analyzer;

    let clearRequested = false;
    let isSilence = true;
    let unsureFrame = 0;

    this.mediaRecorder.ondataavailable = (e) => {
      if (!this.mediaRecorder || this.state === 'idle') return;
      recordedChunks.push(e.data);
      if (this.mediaRecorder.state === 'inactive') return;
      const vol = this.getVolume();
      if (vol > thresholdVolume) {
        if (isSilence) {
          unsureFrame += 1;

          // rising edge
          if (unsureFrame >= nonSilenceFrame) {
            isSilence = false;
            unsureFrame = 0;
          }
        } else {
          unsureFrame = 0;
        }
      } else if (!isSilence) {
        unsureFrame += 1;

        // falling edge
        if (unsureFrame >= silenceFrame) {
          isSilence = true;
          unsureFrame = 0;
          this.mediaRecorder.stop();
        }
      } else {
        // currently in silence mode
        unsureFrame = 0;
        clearRequested = true;
        this.mediaRecorder.stop();
      }
    };

    this.mediaRecorder.onstop = () => {
      if (!this.mediaRecorder || this.state === 'idle') return;
      if (clearRequested) {
        clearRequested = false;
        recordedChunks.length = 0;
        this.mediaRecorder.start(msInFrame);
        return;
      }
      const blob = new Blob(recordedChunks, { type: 'audio/ogg; codecs=opus' });
      recordedChunks.length = 0;
      this.onSpeechEnd(blob);
      this.mediaRecorder.start(msInFrame);
    };

    this.mediaRecorder.start(msInFrame);
  }
}
