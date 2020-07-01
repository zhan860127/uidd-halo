<template>
  <div class="position-relative">
    <Drawer
      v-model="drawerOpen"
      style="transform: translateY(75px);"
      side="top"
    >
      <div id="drawer">
        <div class="above-pad" style="padding-top: 20px; top: -0.5px;">
          <input id="key-input" v-model="keyword" type="text" />
        </div>
        <div id="leftPad"></div>
        <div id="rightPad"></div>
        <div id="ok" @click="onPlusClick">
          OK
        </div>
        <AudioInput
          :class="{ opening: drawerOpen }"
          class="above-pad"
          :clear="clear"
          :edit-blob="blob"
          style="padding: 50px 0px 25px 0px; top: -0.5px;"
          @input="gotBlob"
          @blobChange="blobChanged"
        />
        <div class="plus-wrapper" :class="{ hide: drawerOpen }">
          <div id="plus-button-wapper">
            <b-icon
              id="plus-btn-icon"
              icon="plus-circle"
              @click="onPlusClick"
            />
          </div>
        </div>
      </div>
    </Drawer>
    <div style="margin-top: 10vh;">
      <div v-for="r in responses" :key="r.id" class="listItem">
        <AudioPlayer :path="`/api/keyword/getAudio/${r.id}?${seed}`">
          <template v-slot:center>
            <div class="key-display">
              {{ r.keyword }}
            </div>
          </template>
          <template v-slot:right>
            <b-dropdown
              size="lg"
              variant="link"
              toggle-class="text-decoration-none"
              no-caret
              right
              style="float: right;"
              class="menu-dropdown"
            >
              <template v-slot:button-content>
                <b-icon-three-dots-vertical style="color: #082448;" />
              </template>
              <b-dropdown-item @click="editKey(r.id)">編輯</b-dropdown-item>
              <b-dropdown-item @click="deleteKey(r.id)">刪除</b-dropdown-item>
            </b-dropdown>
          </template>
        </AudioPlayer>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Vue, Component } from 'vue-property-decorator';
import Drawer from '~/components/Drawer.vue';
import AudioInput from '~/components/AudioInput.vue';
import AudioPlayer from '~/components/AudioPlayer.vue';

interface ResponseData {
  id: number;
  keyword: string;
  path: string;
}

const testData: ResponseData[] = [];
function findId(array: ResponseData[], id: number) {
  for (let i = 0; i < array.length; i += 1) {
    if (array[i].id === id) return i;
  }
  return -1;
}

@Component({
  components: { Drawer, AudioInput, AudioPlayer },
  layout: 'parent',
})
export default class classname extends Vue {
  // data
  clear: boolean = false;
  drawerOpen: boolean = false;
  blob: Blob | null = null;
  responses: ResponseData[] = testData;
  keyword: string = '';
  editing: boolean = false; // null: new keyword, otherwise: editing
  editId: number = -999;
  editAudioChange: boolean = false;
  seed: string = (+new Date()).toString();

  // methods
  updateList() {
    axios({
      method: 'get',
      url: '/api/keyword/getKey',
    }).then((res) => {
      this.responses = res.data;
      console.log(this.responses);
    });
  }

  getAudioPath(id: number) {
    return `/api/parent/audiofile/${id}`;
  }

  searchKey(key: string): boolean {
    for (let i = 0; i < this.responses.length; i++) {
      if (this.responses[i].keyword === key) return true;
    }
    return false;
  }

  onPlusClick() {
    if (this.drawerOpen) {
      if (this.editing) {
        const idx = findId(this.responses, this.editId);
        // specialized handling of editing keyword
        if (this.keyword !== this.responses[idx].keyword) {
          // send change keyword req
          if (this.searchKey(this.keyword)) alert('Duplicate already exists!');
          else if (this.keyword === null || this.keyword === '')
            alert('Keyword cannot be blank!');
          else {
            axios({
              method: 'get',
              url: '/api/keyword/changeKey',
              params: {
                id: this.editId,
                key: this.keyword,
              },
            })
              .then((result) => {
                if (!result.data) {
                  console.log('ChangeKey failed');
                }
              })
              .catch((err) => {
                console.error(err);
              });
          }
        }
        if (this.editAudioChange) {
          // send change audio req
          const fd = new FormData();
          fd.append('id', `${this.editId}`);
          fd.append('audio', this.blob!);
          axios({
            method: 'post',
            url: '/api/keyword/changeAudio',
            data: fd,
            headers: { 'Content-Type': 'multipart/form-data' },
          }).then((newPath) => {
            this.responses[idx].path = newPath.data;
            this.seed = (+new Date()).toString();
          });
        }
        this.updateList();
        this.keyword = '';
        this.blob = null;
        this.clear = !this.clear;
        this.editing = false;
        this.drawerOpen = false;
      } else if (this.searchKey(this.keyword))
        alert('Duplicate already exists!');
      else if (this.keyword === null || this.keyword === '')
        alert('Keyword cannot be blank!');
      else if (this.blob === null) alert('Audio is not recorded yet!');
      else {
        const childId = this.$route.query.c;
        const fd = new FormData();
        fd.append('keyword', this.keyword);
        fd.append('audio', this.blob!);
        fd.append('childId', childId as string);
        axios({
          method: 'post',
          url: '/api/keyword/addKeyAudio',
          data: fd,
          headers: { 'Content-Type': 'multipart/form-data' },
        }).then((result) => {
          if (!result.data) alert('Duplicate exists');
          else {
            this.keyword = '';
            this.blob = null;
            this.clear = !this.clear;
            this.updateList();
          }
        });
        this.drawerOpen = false;
      }
    } else {
      this.drawerOpen = true;
    }
  }

  gotBlob(blob: Blob) {
    this.blob = blob;
  }

  blobChanged(state: boolean) {
    this.editAudioChange = state;
  }

  deleteKey(id: number) {
    const idx = findId(this.responses, id);
    this.responses.splice(idx, 1); // skip slow deleting
    axios({
      method: 'get',
      url: '/api/keyword/deleteKey',
      params: {
        id,
      },
    }).then((result) => {
      if (!result) console.log('delete failed');
      this.updateList();
    });
  }

  editKey(id: number) {
    console.log(`edit key id: ${id}`);
    // load data into inputs
    const idx = findId(this.responses, id);
    this.editAudioChange = false;
    this.editing = true;
    this.keyword = this.responses[idx].keyword;
    const path = `/api/keyword/getAudio/${id}`;
    const tempAudio = new Audio(path);
    fetch(tempAudio.src)
      .then((response) => response.blob())
      .then((audio) => {
        this.blob = audio;
      })
      .then(() => {
        this.editId = id;
        this.drawerOpen = true;
      });
  }

  mounted() {
    this.updateList();
  }
}
</script>

<style scoped>
.listItem {
  height: 44px;
  margin: 11px 28px;
  padding-left: 10px;
  background: #fde9d2 0% 0% no-repeat padding-box;
  border-radius: 10px;
}
.key-display {
  display: inline-block;
  position: relative;
  top: 50%;
  color: #082448;
}
.above-pad {
  position: relative;
  z-index: 3;
}
#key-input {
  font-size: 40px;
  color: #082448;
  padding: 0px 20px;
  position: relative;
  left: 50%;
  width: 90vw;
  height: 166px;
  border-radius: 27px;
  transform: translateX(-50%);
  background: #fde9d2 0% 0% no-repeat padding-box;
  border: 0px;
}
.plus-wrapper {
  transform: translateY(-10px);
  position: relative;
  height: 0;
}
#plus-button-wapper {
  background-color: #fabf4d;
  position: relative;
  height: 70px;
  width: 85px;
  left: 50%;
  transform: translateX(-50%) translateY(-25px);
  border-radius: 50%;
}
#plus-btn-icon {
  height: 29.25px;
  width: 29.25px;
  position: relative;
  left: 50%;
  transform: translateX(-50%) translateY(37px);
  z-index: 3;
}
#plus-btn-icon :hover {
  cursor: pointer;
}
#pad {
  transform: translateY(-15px);
  background: #fabf4d;
  border-radius: 15px;
  height: 40px;
}
.hide {
  display: none;
}
#ok {
  position: absolute;
  border-radius: 30px;
  background-color: #082448;
  color: white;
  font-size: 15px;
  width: 40px;
  height: 20px;
  z-index: 5;
  text-align: center;
  top: 89%;
  left: 25%;
}
#ok :hover {
  cursor: pointer;
}
#drawer {
  background-image: url('../../static/background1.png');
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: contain;
}
.opening {
  transform: translateY(65px) translateX(2px);
}
#leftPad {
  position: absolute;
  background: #f0b94e;
  height: 100%;
  width: 40vw;
  top: 0;
  left: 0;
}
#rightPad {
  position: absolute;
  background: #f0b94e;
  height: 100%;
  width: 40vw;
  top: 0;
  right: 0;
}
@media (max-width: 600px) {
  #leftPad {
    position: absolute;
    background: #f0b94e;
    height: 100%;
    width: 30vw;
    top: 0;
    left: 0;
  }
  #rightPad {
    position: absolute;
    background: #f0b94e;
    height: 100%;
    width: 30vw;
    top: 0;
    right: 0;
  }
}
</style>
