<template>
  <div>
    <b-button v-b-modal.modal-1>Add child</b-button>

    <b-modal id="modal-1" title="BootstrapVue">
      <b-form action="/api/parent/add_child" method="POST">
        <b-form-group label="Child's name" label-for="name-input">
          <b-form-input id="name-input" name="name" required></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-form>
    </b-modal>
    <ul>
      <li v-for="(child, i) in children" :key="i">
        <nuxt-link :to="`/parent?c=${child.id}`">{{ child.name }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator';

@Component({
  async asyncData({ $axios }) {
    const children = await $axios.$get('/api/parent/children');
    return { children };
  },
  layout: 'parent',
})
export default class classname extends Vue {}
</script>

<style></style>
