<template>
  <div class="halo-button" @click="$emit('click')">OK</div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';
import '~/assets/scss/_fonts.scss';

@Component
export default class OKButton extends Vue {}
</script>

<style scoped>
.halo-button {
  background-color: #082448;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #fcf6ef;
  font: 17px/23px 'Avenir Book';
  padding: 5px 20px;
  border-radius: 14px;
  margin-right: 25px;
  width: fit-content;
}
</style>
