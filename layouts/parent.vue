<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand>
        <nuxt-link
          :to="
            $route.query.c ? `/parent?c=${$route.query.c}` : `/parent/children`
          "
          ><img
            class="img-fuild"
            style="height: 30px;"
            src="~/assets/img/halo-logo.png"
            alt=""
        /></nuxt-link>
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-button v-b-toggle.side-menu> Menu </b-button>
      </b-navbar-nav>
    </b-navbar>
    <b-sidebar id="side-menu" backdrop right>Menu stuff</b-sidebar>
    <b-container>
      <nuxt />
    </b-container>
  </div>
</template>
