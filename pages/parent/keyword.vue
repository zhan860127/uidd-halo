<template>
  <div class="position-relative">
    <Drawer
      v-model="drawerOpen"
      style="transform: translateY(52px);"
      side="top"
    >
      <div class="above-pad" style="top: -0.5px;">
        <input id="key-input" v-model="keyword" type="text" />
      </div>
      <AudioInput class="above-pad" :clear="clear" @input="gotBlob" />
      <div class="plus-wrapper">
        <div id="pad"></div>
        <div id="plus-button-wapper">
          <b-button class="plus-button" @click="onPlusClick">+</b-button>
        </div>
      </div>
    </Drawer>
    <div style="margin-top: 10vh;">
      <div v-for="r in responses" :key="r.id" class="listItem">
        <div class="key-display">
          {{ r.keyword }}
        </div>
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
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Vue, Component } from 'vue-property-decorator';
import Drawer from '~/components/Drawer.vue';
import AudioInput from '~/components/AudioInput.vue';

interface ResponseData {
  id: number;
  keyword: string;
}

const testData: ResponseData[] = [
  // { id: 1, keyword: "努力加載中(>д<)" },
];

@Component({
  components: { Drawer, AudioInput },
  layout: 'parent',
})
export default class classname extends Vue {
  // data
  clear: boolean = false;
  drawerOpen: boolean = false;
  blob: Blob | null = null;
  responses: ResponseData[] = testData;
  keyword: string = '';
  editing: number | null = null; // null: new keyword, otherwise: editing

  // methods
  updateList() {
    axios({
      method: 'get',
      url: '/api/keyword/getKey',
    }).then((res) => {
      this.responses = res.data;
    });
  }

  searchKey(key: string): boolean {
    for (let i = 0; i < this.responses.length; i++) {
      if (this.responses[i].keyword === key) return true;
    }
    return false;
  }

  onPlusClick() {
    if (this.drawerOpen) {
      if (this.searchKey(this.keyword)) alert('Duplicate already exists!');
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

  deleteKey(id: number) {
    this.responses.splice(id - 1, 1); // skip slow deleting
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
    // load data into inputs
    // TODO: change keyword in other page
    const newKey = prompt('Change Keyword?', '');
    if (newKey === null || newKey === '') {
      console.log('Invalid Input');
    } else if (this.searchKey(newKey)) {
      console.log('Duplicate exists!');
    } else {
      axios({
        method: 'get',
        url: '/api/keyword/changeKey',
        params: {
          id,
          key: newKey,
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
      this.updateList();
    }
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
  transform: translateY(-50%);
}
.above-pad {
  background-color: #fabf4d;
  position: relative;
  z-index: 3;
}
#key-input {
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
  transform: translateX(-50%) translateY(-60px);
  border-radius: 50%;
}
.plus-button {
  color: #082448;
  font-size: 20px;
  background-color: #fabf4d;
  border: 1px solid #082448;
  position: relative;
  left: 50%;
  transform: translateX(-50%) translateY(30px);
  border-radius: 50%;
  z-index: 3;
  padding: 0px 8px;
}
#pad {
  transform: translateY(-15px);
  background: #fabf4d;
  border-radius: 10px;
  height: 40px;
}
</style>
