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
  state = 'idle';

  async start() {
    if (this.state === 'started') return;
    this.state = 'started';
    const stream = await window.navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    this.onStarted();
    this.onGotStream(stream);
  }

  getVolume(): number {
    // normalized volume in 0-1
    const arr = new Float32Array(this.#analyzer!.fftSize);
    this.#analyzer!.getFloatTimeDomainData(arr);
    const p = arr.map((x) => x ** 2).reduce((a, b) => a + b) / arr.length;
    return (32 + Math.log2(p)) / 32;
  }

  private onGotStream(stream: MediaStream) {
    const recordedChunks: Blob[] = [];
    const mediaRecorder = new MediaRecorder(stream);
    const ctx = new window.AudioContext();
    const analyzer = ctx.createAnalyser();
    const srcNode = ctx.createMediaStreamSource(stream);
    srcNode.connect(analyzer);
    this.#analyzer = analyzer;

    let firstFrame: Blob | undefined;
    let isSilence = false;
    let unsureFrame = 0;

    mediaRecorder.ondataavailable = (e) => {
      if (!firstFrame) {
        firstFrame = e.data;
      }
      const vol = this.getVolume();
      if (vol > thresholdVolume) {
        recordedChunks.push(e.data);
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
        recordedChunks.push(e.data);

        // falling edge
        if (unsureFrame >= silenceFrame) {
          isSilence = true;
          unsureFrame = 0;

          // emit the recorded speech
          recordedChunks.splice(0, 0, firstFrame);
          const blob = new Blob(recordedChunks);
          this.onSpeechEnd(blob);
        }
      } else {
        // currently in silence mode
        unsureFrame = 0;
        recordedChunks.length = 0;
      }
    };

    mediaRecorder.start(msInFrame);
  }
}
