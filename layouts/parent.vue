<template>
  <div>
    <div id="parent-root">
      <b-navbar
        type="light"
        class="parent-bar"
        :class="{ settings }"
        :sticky="true"
      >
        <div v-if="!settings">
          <b-icon-list
            style="height: auto; width: 30px;"
            @click="menuOpen = true"
          />
        </div>
        <div class="flex-grow-1 navbar-title">
          <span v-if="!settings"> {{ title }}</span>
        </div>
        <nuxt-link to="/parent/children">
          <ChildStatus
            :child-id="currentChildStatus.id"
            :online="currentChildStatus.online"
        /></nuxt-link>
      </b-navbar>
      <div class="tabs">
        <template v-if="settings">
          <nuxt-link
            :to="`/parent/settings?c=${$route.query.c}`"
            class="tab"
            :class="{ active: !qr }"
            >基本資料</nuxt-link
          >
          <nuxt-link
            :to="`/parent/connect?c=${$route.query.c}`"
            class="tab"
            :class="{ active: qr }"
            >QRCODE</nuxt-link
          ></template
        >
      </div>
      <nuxt id="nuxt" />
      <Navbar />
    </div>

    <Drawer v-model="menuOpen" side="bottom">
      <div id="drawer-menu">
        <div class="drawer-menu-item">
          <div class="drawer-menu-item-icon">
            <fa icon="cog" />
          </div>
          <nuxt-link
            :to="`/parent/settings?c=${$route.query.c}`"
            class="drawer-menu-item-label"
            >設定基本資料</nuxt-link
          >
        </div>
        <div class="drawer-menu-item">
          <div class="drawer-menu-item-icon">
            <fa icon="qrcode" />
          </div>
          <nuxt-link
            class="drawer-menu-item-label"
            :to="`/parent/connect?c=${$route.query.c}`"
            >QR CODE</nuxt-link
          >
        </div>
        <div class="drawer-menu-item">
          <div class="drawer-menu-item-icon">
            <fa icon="sign-out-alt" />
          </div>
          <div class="drawer-menu-item-label">登出</div>
        </div>
        <div class="child-list">
          <nuxt-link
            v-for="child in childStatus"
            :key="child.id"
            class="sidebar-item plain pointer"
            :to="`/parent?c=${child.id}`"
          >
            <ChildStatus :child-id="child.id" :online="child.online" />
          </nuxt-link>
        </div>
      </div>
    </Drawer>
    <b-sidebar id="side-menu" backdrop right>
      <div class="sidebar-item">設定基本資料</div>
      <nuxt-link
        v-if="$route.query.c"
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
  </div>
</template>

<script lang="ts">
import { Vue, Component, Ref, Watch } from 'vue-property-decorator';
import { BDropdown } from 'bootstrap-vue';
import '~/assets/scss/_fonts.scss';
import io from 'socket.io-client';
import Navbar from '~/components/Navbar.vue';
import Drawer from '~/components/Drawer.vue';
import ChildStatus from '~/components/ChildStatus.vue';

@Component({
  components: { Navbar, Drawer, ChildStatus },
})
export default class classname extends Vue {
  menuOpen = false;

  mounted() {
    io.connect('/parent')
      .on('status', (v: any) => {
        this.$store.commit('parent/setChildStatus', v);
      })
      .on('/logs', () => {
        this.$store.commit('parent/incLogsVer');
      });
    this.func();
  }

  func() {
    const vh = window.innerHeight * 0.01;
    (document.getElementById(
      'parent-root'
    ) as HTMLInputElement).style.setProperty('--vh', `${vh}px`);
  }

  get settings() {
    const p = this.$route.path;
    return p.startsWith('/parent/settings') || p.startsWith('/parent/connect');
  }

  get qr() {
    return !this.$route.path.startsWith('/parent/settings');
  }

  get title(): string {
    const p = this.$route.path;
    return p.startsWith('/parent/logs')
      ? 'Record'
      : p.startsWith('/parent/keyword')
      ? 'Response'
      : p.startsWith('/parent/call')
      ? 'Call'
      : p.startsWith('/parent/alarm')
      ? 'Alarm'
      : '';
  }

  get childStatus(): any {
    return this.$store.state.parent.childStatus;
  }

  get currentChildStatus() {
    return (
      this.childStatus.filter(
        (child: { id: number }) => child.id === +this.$route.query.c
      )[0] || {}
    );
  }

  @Ref('dropdown') dropdown!: BDropdown;
  @Watch('$route')
  closeDropdown() {
    this.menuOpen = false;
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
  height: 100vh;
  overflow-y: auto;
  display: grid;
  grid-template-rows: min-content 0 1fr min-content;
}

.parent-bar {
  background-color: #ffffff;
  box-shadow: 0px 0px 5px #23181559;
  color: #082448;
  height: 73px;
  position: relative;
  z-index: 0;
  &.settings {
    background-color: #082448;
    box-shadow: none;
  }
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

#nuxt {
  overflow-y: auto;
}

#drawer-menu {
  background-color: white;
  box-shadow: 0px 3px 6px #00000029;
  border-radius: 20px 20px 0 0;
  padding-top: 10px;
}

.navbar-title {
  font: 20px/27px 'Avenir Book';
  text-align: center;
  font-weight: bold;
}

#nav-profile {
  height: 40px;
}

.drawer-menu-item {
  height: 70px;
  display: flex;
}

.drawer-menu-item-icon {
  font-size: 24px;
  padding-left: 43px;
  padding-right: 28px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding-bottom: 14px;
  color: #666666;
}

.drawer-menu-item-label {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  color: #082448;
  font: 15px/20px 'Avenir Book';
  padding-bottom: 16.5px;
  border-bottom: 1px solid #707070;
  flex-grow: 1;
}

.child-list {
  padding: 25px 40px 17px;
  overflow-x: auto;
  display: flex;
  & > * + * {
    margin-left: 25px;
  }
}

.tabs {
  position: relative;
  height: 0;
  overflow: visible;
  z-index: 1;
  display: flex;
  & .tab {
    color: #082448;
    display: flex;
    background-color: orange;
    width: 91px;
    height: 28px;
    border-radius: 14px 14px 0 0 / 14px 14px 0 0;
    justify-content: center;
    align-items: flex-end;
    transform: translateY(-100%);
    margin-left: 17px;
    & + & {
      margin-left: 8px;
    }
    &.active {
      background-color: #fcf6ef;
    }
  }
}
</style>
