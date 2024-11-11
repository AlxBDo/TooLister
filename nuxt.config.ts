// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "@nuxt/ui", "@sidebase/nuxt-auth", "@nuxt/icon"],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' }
  },
  auth: {
    baseURL: 'http://127.0.0.1:8741',
    provider: {
      type: 'local',
      endpoints: {
        signIn: { path: '/login_check', method: 'post' },
        signUp: { path: '/user/new', method: 'post' },
        getSession: false
      },
      token: { signInResponseTokenPointer: '/token' },
    }
  },
  css: ['~/assets/css/main.css'],
  plugins: ['~/plugins/persistStore'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      appName: 'ListAllApp',
      cryptKey: process.env.CRYPT_KEY,
      cryptIv: process.env.CRYPT_IV,
      ENTRYPOINT: process.env.ENTRYPOINT
    }
  }
})