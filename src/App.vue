<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  created: function () {
    if (document.documentElement.clientWidth > 640) {
      require('./assets/css/pc.css')
    } else {
      require('./assets/css/mobile.css')
    }
  }
}
</script>
