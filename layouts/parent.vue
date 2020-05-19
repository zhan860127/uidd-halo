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
    <b-sidebar id="side-menu" backdrop right>
      <div class="sidebar-item">設定基本資料</div>
      <nuxt-link
        class="sidebar-item"
        style="color: inherit;"
        :to="`/parent/connect?c=${$route.query.c}`"
        >QR CODE</nuxt-link
      >
      <div class="sidebar-item">登出</div>
      <div class="sidebar-divider"></div>
      <nuxt-link
        v-for="child in childStatus"
        :key="child.id"
        class="sidebar-item plain pointer"
        :to="`/parent?c=${child.id}`"
      >
        <div class="child-dot" :class="{ online: child.online }"></div>
        <div class="flex-grow-1">{{ child.name }}</div>
        <div class="child-online">{{ child.online ? '上線中' : '離線中' }}</div>
      </nuxt-link>
    </b-sidebar>
    <nuxt />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import { BDropdown } from 'bootstrap-vue';
import '~/assets/scss/_fonts.scss';
import io from 'socket.io-client';

@Component
export default class classname extends Vue {
  mounted() {
    io.connect('/parent').on('status', (v: any) => {
      this.$store.commit('parent/setChildStatus', v);
      // @ts-ignore
      window.v = v;
      console.log(v);
    });
  }

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

  get childStatus(): any {
    return this.$store.state.parent.childStatus;
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
  height: 52px;
}

.plain,
.plain:hover {
  color: inherit;
  text-decoration: inherit;
  cursor: inherit;
}

.pointer,
.pointer:hover {
  cursor: pointer;
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

.child-dot {
  width: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  &::before {
    content: '';
    background-color: #707070;
    border-radius: 50%;
    width: 6px;
    height: 6px;
  }
  &.online::before {
    background-color: #17c125;
  }
}

.child-online {
  font-size: 10px;
  margin-right: 7px;
}

#side-menu {
  background-color: #fcf6ef !important;
  & > header {
    background-color: #4d6790;
    min-height: 52px;
  }
  & .b-sidebar-body {
    padding: 17px 12px;
  }

  & .sidebar-item {
    width: 100%;
    height: 28px;
    font: 15px/20px 'Avenir Book';
    background-color: #fde9d2;
    border-radius: 7px;
    display: flex;
    align-items: center;
    padding: initial 3px;
  }
  & .sidebar-item + .sidebar-item {
    margin-top: 7px;
  }
  .sidebar-divider {
    height: 0px;
    width: 100%;
    border: 1px solid #082448;
    margin: 16.5px 0;
  }
}
</style>
