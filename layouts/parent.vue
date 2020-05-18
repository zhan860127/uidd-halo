<template>
  <div id="parent-root">
    <b-navbar type="dark" class="parent-bar">
      <b-navbar-brand>
        <nuxt-link
          :to="
            $route.query.c ? `/parent?c=${$route.query.c}` : `/parent/children`
          "
          class="plain"
          ><b-icon-house-door-fill style="height: auto; width: 30px;"
        /></nuxt-link>
      </b-navbar-brand>
      <b-navbar-nav class="flex-grow-1">
        <b-nav-item-dropdown
          v-if="title"
          ref="dropdown"
          :text="title"
          class="mx-auto nav-dropdown"
        >
          <nuxt-link
            class="dropdown-item"
            :to="`/parent/logs?c=${$route.query.c}`"
            @click="closeDropdown"
            >Recordings</nuxt-link
          >
          <nuxt-link
            class="dropdown-item"
            :to="`/parent/keywords?c=${$route.query.c}`"
            >Response</nuxt-link
          >
          <nuxt-link
            class="dropdown-item"
            :to="`/parent/call?c=${$route.query.c}`"
            >Call</nuxt-link
          >
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <b-navbar-nav>
        <b-icon-list v-b-toggle.side-menu style="height: 27px; width: 27px;" />
      </b-navbar-nav>
    </b-navbar>
    <b-sidebar id="side-menu" backdrop right>Menu stuff</b-sidebar>
    <nuxt />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import { BDropdown } from 'bootstrap-vue';
import '~/assets/scss/_fonts.scss';

@Component
export default class classname extends Vue {
  get title(): string {
    const p = this.$route.path;
    return p.startsWith('/parent/logs')
      ? 'Recordings'
      : p.startsWith('/parent/keywords')
      ? 'Response'
      : p.startsWith('/parent/call')
      ? 'Call'
      : '';
  }

  @Ref('dropdown') dropdown!: BDropdown;
  @Watch('$route')
  closeDropdown() {
    if (this.dropdown) this.dropdown.hide();
  }
}
</script>

<style lang="scss">
html,
body {
  scroll-behavior: smooth;
}

#parent-root {
  background-color: #fcf6ef;
  min-height: 100vh;
}

.parent-bar {
  background-color: #fabf4d;
  color: #fcf6ef;
}

.plain,
.plain:hover {
  color: inherit;
  text-decoration: inherit;
  cursor: inherit;
}

.nav-dropdown .dropdown-menu {
  left: 50%;
  transform: translateX(-50%);
}

.nav-dropdown {
  font: 20px/27px 'Avenir Book';
  font-weight: bold;
  & .nav-link {
    color: #fcf6ef !important;
  }
}
</style>
