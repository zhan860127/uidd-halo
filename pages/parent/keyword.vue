<template>
  <div class="position-relative">
    <Drawer v-model="drawerOpen" side="top">
      <div>
        <input v-model="keyword" type="text" />
      </div>
      <AudioInput @input="gotBlob" />
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
    <button @click="addTestKey">AddKey-for testing</button>
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
      else {
        //  TODO: send the blob also
        console.log(`Start addKey, key: ${this.keyword}`);
        axios({
          method: 'get',
          url: '/api/keyword/addKey',
          params: {
            key: this.keyword,
          },
        }).then((result) => {
          if (!result.data) alert('Duplicate exists!');
          else this.updateList();
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
    axios({
      method: 'get',
      url: '/api/keyword/deleteKey',
      params: {
        id,
      },
    }).then((result) => {
      if (!result) console.log('delete failed');
    });
    this.updateList();
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

  addTestKey() {
    const keyword = prompt('Key?', '');
    if (keyword === null || keyword === '') alert('Invalid input');
    else {
      console.log(`Start addKey, key: ${keyword}`);
      axios({
        method: 'get',
        url: '/api/keyword/addKey',
        params: {
          key: keyword,
        },
      }).then((result) => {
        if (!result.data) alert('Duplicate exists!');
        else this.updateList();
      });
    }
  }

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
