<template>
  <div>
    <textarea id="keyword" v-model="keyword"></textarea>
    <button @click="record">RECORD</button>
    <button @click="addKey">SUBMIT</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keyword: '',
    };
  },
};
</script>
