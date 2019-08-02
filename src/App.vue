<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <!--<router-view/>-->
  <editor></editor>
  </div>
</template>

<script>
  import Editor from "@/components/Editor.vue";
  export default {
    name: 'app',
    components:{Editor},
  }
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  overflow: auto;
}
</style>
