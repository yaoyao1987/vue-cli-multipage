<template>
  <div id="app">
    <img class="logo" src="../../assets/logo.png">
    <hello></hello>
    <p>
      Welcome to your Vue.js app!
    </p>
  </div>
  <button class="btn btn-success btn-lg"
    @click="showRight = !showRight">
    Click to toggle alert on right
  </button>
  <alert
    :show.sync="showRight"
    :duration="3000"
    type="success"
    width="400px"
    placement="top-right"
    dismissable
  >
    <span class="icon-ok-circled alert-icon-float-left"></span>
    <strong>Well Done!</strong>
    <p>You successfully read this important alert message.</p>
  </alert>
</template>

<script>
import Hello from '../../components/Hello'
import alert from '../../components/bootstrap/Alert'

export default {
  data() {
    return {
      showRight: false,
      showTop: false
    }
  },
  components: {
    Hello,
    alert
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}
</style>
