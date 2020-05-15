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
      <b-navbar-nav class="ml-auto">
        <b-icon-list v-b-toggle.side-menu style="height: 27px; width: 27px;" />
      </b-navbar-nav>
    </b-navbar>
    <b-sidebar id="side-menu" backdrop right>Menu stuff</b-sidebar>
    <b-container>
      <nuxt />
    </b-container>
  </div>
</template>

<style>
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
</style>
