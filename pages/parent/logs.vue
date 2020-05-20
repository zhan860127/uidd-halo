<template>
  <div class="position-relative">
    <div class="buttons">
      <div class="half-pill" @click="dateDrawerOpen = !dateDrawerOpen">
        <b-icon-calendar style="width: 14px; height: auto;" />
      </div>
      <div class="half-pill">
        <b-icon-heart-fill style="width: 14px; height: auto;" />
      </div>
    </div>
    <b-container>
      <div v-for="group in sortedAudios" :key="+group[0]" class="logs-group">
        <div class="logs-header">{{ formattedDate(group[0]) }}</div>
        <AudioLog
          v-for="audio in group[1]"
          :key="audio.id"
          :data-audio-id="audio.id"
          :audio="audio"
          @edit-audio="onAudioEdit"
          @delete-audio="onAudioDelete"
        />
      </div>
      <b-modal ref="editModal" title="編輯" @ok="onEditOk">
        <b-form>
          <b-form-group label="內容" label-for="transcript-input">
            <b-form-input
              id="transcript-input"
              v-model="transcript"
              required
            ></b-form-input>
          </b-form-group>
        </b-form>
      </b-modal>
      <b-modal
        ref="deleteModal"
        title="刪除"
        ok-variant="danger"
        ok-title="刪除"
        @ok="onDeleteOk"
      >
        <h4 class="my-4">確認刪除錄音？</h4>
        <p v-if="audio">{{ audio.transcript }}</p>
      </b-modal>
    </b-container>
    <b-sidebar id="date-drawer" bottom>
      hello
    </b-sidebar>
    <Drawer v-model="dateDrawerOpen" side="bottom">
      <div
        class="d-flex justify-content-center"
        style="background-color: #fcf6ef; padding-bottom: 20px;"
      >
        <div style="width: 100%; max-width: 500px;">
          <DatePicker v-model="date" :highlighted="highlights" />
          <div class="times">
            <div
              v-for="x in audiosThisDay"
              :key="x.id"
              class="time"
              :class="{ selected: audio && audio.id === x.id }"
              @click="onAudioSelected(x)"
            >
              {{ audioTime(x) }}
            </div>
          </div>
          <div class="halo-button" @click="onAudioSelectCommit">OK</div>
        </div>
      </div>
    </Drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import { BModal } from 'bootstrap-vue';
import dayjs from 'dayjs';
import AudioLog from '~/components/AudioLog.vue';
import { AudioData } from '~/assets/ts/AudioData';
import DatePicker from '~/components/DatePicker.vue';
import Drawer from '~/components/Drawer.vue';
import '~/assets/scss/_fonts.scss';

async function childAudios($axios: any, query: any): Promise<AudioData[]> {
  const audios = await $axios.$get('/api/parent/child_audio', {
    params: { c: query.c },
  });
  audios.forEach((x: any) => {
    x.date = new Date(x.date);
  });
  return audios;
}

@Component({
  components: {
    AudioLog,
    DatePicker,
    Drawer,
  },
  layout: 'parent',
  async asyncData({ $axios, query }) {
    return { audios: await childAudios($axios, query) };
  },
})
export default class classname extends Vue {
  transcript: string = '';
  audio: AudioData | null = null;
  audios: AudioData[] = [];
  dateDrawerOpen: boolean = false;
  date: Date = new Date();
  @Ref() readonly editModal!: BModal;
  @Ref() readonly deleteModal!: BModal;

  @Watch('date')
  onDateChanged() {
    this.audio = null;
  }

  onAudioEdit(e: AudioData) {
    this.transcript = e.transcript;
    this.audio = e;
    this.editModal.show();
  }

  onAudioDelete(e: AudioData) {
    this.transcript = e.transcript;
    this.audio = e;
    this.deleteModal.show();
  }

  get audiosThisDay(): AudioData[] {
    for (const pair of this.sortedAudios) {
      if (dayjs(pair[0]).isSame(dayjs(this.date), 'day')) {
        return pair[1].reverse();
      }
    }
    return [];
  }

  get logsVer(): number {
    return this.$store.state.parent.logsVer;
  }

  @Watch('logsVer')
  async onLogsChange() {
    console.log('logs changed');
    this.audios = await childAudios(this.$axios, this.$route.query);
  }

  audioTime(data: AudioData): string {
    return dayjs(data.date).format('H:mm');
  }

  formattedDate(date: Date) {
    return dayjs(date).format('YYYY/MM/DD');
  }

  onAudioSelected(data: AudioData) {
    this.audio = data;
  }

  onAudioSelectCommit() {
    this.dateDrawerOpen = false;
    if (!this.audio) return;
    const el = this.$el.querySelector(`[data-audio-id="${this.audio.id}"]`);
    this.audio = null;
    if (el) {
      el.scrollIntoView();
    }
  }

  get highlights(): Date[] {
    return this.sortedAudios.map((x) => new Date(x[0]));
  }

  get sortedAudios(): [Date, AudioData[]][] {
    // audios grouped by date, newest first

    const dict = new Map<string, AudioData[]>();

    // group it
    this.audios.forEach((x) => {
      const k = dayjs(x.date).format('YYYY-MM-DD');
      if (!dict.has(k)) dict.set(k, []);
      dict.get(k)!.push(x);
    });

    // sort each day
    dict.forEach((v) => {
      v.sort((a, b) => +b.date - +a.date);
    });

    // sort dates
    const out: [Date, AudioData[]][] = [];
    [...dict.keys()]
      .sort()
      .reverse()
      .forEach((k) => {
        out.push([new Date(k), dict.get(k)!]);
      });
    return out;
  }

  async onEditOk() {
    this.audio!.transcript = this.transcript;
    await this.$axios.$post('/api/parent/child_audio/edit', {
      id: this.audio!.id,
      transcript: this.transcript,
    });
    const index = this.audios.findIndex((x) => x.id === this.audio!.id);
    this.audios.splice(index, 1, Object.assign({}, this.audio));
  }

  async onDeleteOk() {
    await this.$axios.$post(`/api/parent/child_audio/delete/${this.audio!.id}`);
    const index = this.audios.findIndex((x) => x.id === this.audio!.id);
    this.audios.splice(index, 1);
  }
}
</script>

<style lang="scss" scoped>
.buttons {
  position: sticky;
  top: 0px;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-end;
  height: 81px;
}
.half-pill {
  background-color: #4d6790;
  width: 38px;
  height: 31px;
  border-radius: 50% 0 0 50%;
  color: #fcf6ef;
  display: flex;
  justify-content: center;
  align-items: center;

  & + & {
    margin-top: 7px;
  }
}

.logs-group {
  padding-bottom: 50px;

  .logs-header {
    text-align: right;
    font: 20px/27px 'Avenir Book';
    margin-bottom: 20px;
  }
}

.times {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  justify-items: center;
  row-gap: 0.4em;
  padding: 25px 30px;
  position: relative;

  & > .time {
    width: 37px;
    border: 1px solid #082448;
    display: flex;
    justify-content: center;
    align-items: center;

    font: 10px/14px 'Avenir Book';
    &.selected {
      color: #fcf6ef;
      background-color: #082448;
    }
  }

  &::before {
    content: '';
    height: 1px;
    background-color: #082448;
    position: absolute;
    left: 25px;
    right: 25px;
  }
}

.halo-button {
  background-color: #082448;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fcf6ef;
  font: 17px/23px 'Avenir Book';
  padding: 5px 20px;
  border-radius: 14px;
  float: right;
  margin-right: 25px;
}
</style>
