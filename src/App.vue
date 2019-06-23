<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <canvas width="100%" height="100%" id="renderCanvas"></canvas>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from "vue-property-decorator"
  import HelloWorld from "./components/HelloWorld.vue"

  @Component({
  components: {
    HelloWorld
  }
})
export default class App extends Vue {}
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#renderCanvas {
  position: absolute;
  left: 0;
  top: 0;
  margin: 0;
  padding: 0;
}
</style>
