import process from 'process';
import fs from 'fs';
import myapi from './server/api';
require('reflect-metadata');
require('dotenv').config();

export default {
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@nuxt/typescript-build',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module',
    '@nuxtjs/dotenv',
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://bootstrap-vue.js.org
    'bootstrap-vue/nuxt',
    '@nuxtjs/pwa',
    // Doc: https://github.com/nuxt-community/dotenv-module
    ['@nuxtjs/axios', { browserBaseURL: '/' }],

    '~/modules/io',
  ],

  bootstrapVue: {
    icons: true, // Install the IconsPlugin (in addition to BootStrapVue plugin
  },

  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
  },
  serverMiddleware: [{ path: '/api', handler: myapi }],
  server: process.env.HTTPS_KEY_PATH
    ? {
        https: {
          cert: fs.readFileSync(process.env.HTTPS_CERT_PATH),
          key: fs.readFileSync(process.env.HTTPS_KEY_PATH),
        },
      }
    : {},
};
