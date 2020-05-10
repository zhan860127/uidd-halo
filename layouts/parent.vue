<template>
  <div>
    <b-navbar type="dark" variant="dark">
      <b-navbar-brand> HALO </b-navbar-brand>
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
