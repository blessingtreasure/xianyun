<template>
  <div id="container">
    <script
      type="text/javascript"
      src="https://webapi.amap.com/maps?v=1.4.15&key=ff831391f19ff347e5c4ff2e8490a9ed"
    ></script>
  </div>
</template>

<script>
export default {
  mounted() {
    // 创建地图实例
    var map = new AMap.Map("container");
  }
};
</script>

<style scoped>
#container {
  width: 300px;
  height: 300px;
  margin: 100px;
}
</style>