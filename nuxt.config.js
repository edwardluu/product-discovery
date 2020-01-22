
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: 'Product Discovery',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { 
    color: 'rgb(234, 52, 31)',
    height: '5px' 
  },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/infiniteloading', ssr: false,  mode: 'client' },
    { src: '~/plugins/vue-slick.js', ssr: false ,  mode: 'client'  },
    { src: '~/plugins/element-ui.js', ssr: false ,  mode: 'client'  }
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  },
  server: {
    port:3030,
  },
  axios: {
    baseURL: 'https://listing.services.teko.vn/api/'
  }
}
