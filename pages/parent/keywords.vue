<template>
  <div>
    <button @click="addKey">Add Keyword</button>
    <ol>
      <li v-for="(item, idx) in list" :key="item.id">
        {{ item.keyword }}
        <button @click="show(idx)">Options</button>
        <button v-show="item.seen" @click="changeKey(idx)">Edit</button>
        <button v-show="item.seen" @click="deleteItem(idx)">Delete</button>
      </li>
    </ol>
    <button @click="test">TEST-adding fake data</button>
    <Drawer v-model="recorderDrawerOpen" side="top">
      <KeyAudioForm></KeyAudioForm>
    </Drawer>
  </div>
</template>

<script>
import $ from 'jquery';
import Drawer from '~/components/Drawer.vue';
import KeyAudioForm from '~/components/KeyAudioForm.vue';
export default {
  components: { Drawer, KeyAudioForm },
  data() {
    return {
      list: [
        //  { id: 0, keyword: 'nya', path: './somewhere/nya.ogg', seen: false },
      ],
      selectItem: 0,
      recorderDrawerOpen: false,
    };
  },
  mounted() {
    $.ajax({
      type: 'GET',
      url: '/api/keyword/getKey',
      data: '',
      success: (keyList) => {
        keyList = JSON.parse(keyList);
        keyList.forEach((element) => {
          element.seen = false;
        });
        this.list = keyList;
      },
      error() {
        console.log('get keyword list failed');
      },
    });
  },
  methods: {
    addKey() {
      this.recorderDrawerOpen = true;
    },

    show(idx) {
      this.selectItem = idx;
      this.list[this.selectItem].seen = !this.list[this.selectItem].seen;
    },

    changeKey(idx) {
      this.selectItem = idx;
      const temp = this.list[this.selectItem].keyword;
      const newKey = prompt('Change keyword?', ''); // TODO: edit in recorder
      if (newKey === null || newKey === '') {
        console.log('Invalid input');
      } else {
        this.list[this.selectItem].keyword = newKey;
      }
      $.ajax({
        type: 'GET',
        url: '/api/keyword/changeKey',
        data: {
          id: this.list[this.selectItem].id,
          key: newKey,
        },
        success: (result) => {
          if (!result) {
            this.list[this.selectItem].keyword = temp;
            console.log('Keyword already exists!');
          }
        },
      });
    },

    deleteItem(idx) {
      this.selectItem = idx;
      $.ajax({
        type: 'GET',
        url: '/api/keyword/deleteKey',
        data: {
          id: this.list[this.selectItem].id,
        },
        success: (result) => {
          if (!result) console.log('delete failed');
        },
      });
      //  update the list
      $.ajax({
        type: 'GET',
        url: '/api/keyword/getKey',
        data: '',
        success: (keyList) => {
          keyList = JSON.parse(keyList);
          keyList.forEach((element) => {
            element.seen = false;
          });
          this.list = keyList;
        },
        error() {
          console.log('get keyword list failed');
        },
      });
    },

    test() {
      const keyword = prompt(
        'キイワードは何ですか？',
        'ここでタイプしましょう。'
      );
      if (keyword === null || keyword === '') alert('冇野喎');
      else {
        console.log(`Start addKey, key: ${keyword}`);
        $.ajax({
          type: 'GET',
          url: '/api/keyword/addKey',
          data: {
            key: keyword,
          },
          success: (result) => {
            if (!result) alert('Duplicate exists!');
            else {
              $.ajax({
                type: 'GET',
                url: '/api/keyword/getKey',
                data: '',
                success: (keyList) => {
                  keyList = JSON.parse(keyList);
                  keyList.forEach((element) => {
                    element.seen = false;
                  });
                  this.list = keyList;
                },
                error() {
                  console.log('get keyword list failed');
                },
              });
            }
          },
          error() {
            console.log('addKey failed');
          },
        });
      }
    },
  },
  layout: 'parent',
};
</script>

<style></style>
