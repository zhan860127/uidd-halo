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
  </div>
</template>

<script>
/* import func from '../../vue-temp/vue-editor-bridge'; */
import $ from 'jQuery';
export default {
  data() {
    return {
      list: [
        { id: 0, keyword: 'nya', path: './somewhere/nya.ogg', seen: false },
      ],
      selectItem: 0,
    };
  },
  mounted() {
    $.ajax({
      type: 'GET',
      url: './api/getKey',
      data: '',
      success: (keyList) => {
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
      // open the recorder
    },

    show(idx) {
      this.selectItem = idx;
      this.list[this.selectItem].seen = !this.list[this.selectItem].seen;
    },

    changeKey(idx) {
      // TODDO: check new keyword exist
      this.selectItem = idx;
      const newKey = prompt('Change keyword?', ''); // TODO: edit in recorder
      if (newKey === null || newKey === '') {
        console.log('Invalid input');
      } else {
        this.list[this.selectItem].keyword = newKey;
      }
      $.ajax({
        type: 'GET',
        url: './api/changeKey',
        data: {
          id: this.list[this.selectItem].id,
          key: newKey,
        },
      });
    },

    deleteItem(idx) {
      this.list[this.selectItem] = idx;
      $.ajax({
        type: 'GET',
        url: './api/deleteKey',
        data: {
          id: this.list[this.selectItem].id,
        },
      });

      $.ajax({
        type: 'GET',
        url: './api/getKey',
        data: '',
        success: (keyList) => {
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
  },
};
</script>

<style></style>
