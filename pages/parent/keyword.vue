<template>
  <div class="position-relative">
    <Drawer v-model="drawerOpen" side="top">
      <div>
        <input v-model="keyword" type="text" />
      </div>
      <AudioInput @input="on" />
      <div class="plus-wrapper">
        <b-button class="plus-button" @click="onPlusClick">+</b-button>
      </div>
    </Drawer>
    <div>
      <div v-for="r in responses" :key="r.id">
        {{ r.keyword }}
        <b-dropdown
          size="lg"
          variant="link"
          toggle-class="text-decoration-none"
          no-caret
          right
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
// import { Vue, Component, Prop } from 'vue-property-decorator';
import Drawer from '~/components/Drawer.vue';
import AudioInput from '~/components/AudioInput.vue';

interface ResponseData {
  id: number;
  keyword: string;
}

const testData: ResponseData[] = [
  { id: 1, keyword: 'foo' },
  { id: 2, keyword: 'bar' },
  { id: 3, keyword: 'baz' },
  { id: 4, keyword: 'egg' },
];

function searchKey(key: string, array: Array<ResponseData>): boolean {
  array.forEach((element) => {
    if (element.keyword === key) return true;
  });
  return false;
}

@Component({
  components: { Drawer, AudioInput },
  layout: 'parent',
})
export default class classname extends Vue {
  // data
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
      // let keyList = res.data;
      console.log(res.data);
      this.responses = res.data;
    });
  }

  onPlusClick() {
    if (this.drawerOpen) {
      // add keyword?
    } else {
      this.drawerOpen = true;
    }
  }

  gotBlob(blob: Blob) {
    this.blob = blob;
  }

  deleteKey(id: number) {
    // TODO: del key
    console.log(id); // prevent error from lint
  }

  editKey(id: number) {
    // load data into inputs
    const newKey = prompt('Change Keyword?', '');
    if (newKey === null || newKey === '') {
      console.log('Invalid Input');
    } else if (searchKey(newKey, this.responses)) {
      console.log('Duplicate exists!');
    } else {
      this.responses[id].keyword = newKey;
    }

    axios({
      method: 'get',
      url: '/api/keyword/test',
      data: {
        id,
        key: newKey,
      },
    })
      .then((result) => {
        if (!result) {
          console.log('ChangeKey failed');
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }

  // mounted
  mounted() {
    this.updateList();
  }
}
</script>

<style scoped>
.plus-wrapper {
  position: relative;
  height: 0;
}
</style>
