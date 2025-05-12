/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./node_modules/flowbite/**/*.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'theme-orange': '#7c6a48',
        'theme-orange-selected': '#9d8e71',
        'theme-basic-orange': '#edebe9',
        'theme-basic-orange-dropdown': '#efefef',
        'theme-white': '#ffffff',
        'theme-black': '#111111',
        'theme-gray': '#d9d9d9',
        'theme-strong-gray': '#767676',
        'theme-play-blue': '#3089F0',
        'theme-purple': '#bd5298',
        'theme-side-bar': '#2c2c2c',
        'theme-olive-brown': '#85724e',
        'theme-olive-brown-vivid': '#c9993d',
        'theme-olive-brown-selected': '#6a5b3e',
        'theme-olive-light-brown': '#b6aa95',
        'theme-olive-light-brown-selected': '#f3f1ed',
        'theme-gray-button': '#afa89c',
        'theme-gray-button-selected': '#c9c5bd',
        'theme-gray-header': '#f2f2f2',
        'theme-gray-disabled': '#aeaeae',
        'theme-gray-border': '#ebebeb',
        'theme-warning': '#f26660',
        'theme-warning-selected': '#c2524d'
      }
    },
  },
}