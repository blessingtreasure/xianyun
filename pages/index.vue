<template>
  <div class="container">
    <!-- 幻灯片 -->
    <el-carousel :interval="5000" arrow="always">
      <el-carousel-item v-for="(item, index) in banners" :key="index">
        <div
          class="banner-image"
          :style="`
                background:url(${$axios.defaults.baseURL}${item.url}) center center no-repeat;
                background-size:contain contain;
                `"
        ></div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script>
export default {
  mounted() {
    this.$axios({
      url: "/scenics/banners",
      method: "get"
    })
      .then(res => {
        const { data } = res;
        this.banners = data.data;
        console.log(this.banners);
      })
      .catch(err => {});
  },
  data() {
    return {
      // 轮播图数据
      banners: []
    };
  }
};
</script>

<style scoped lang="less">
.container {
  min-width: 1000px;
  margin: 0 auto;
  position: relative;

  /deep/ .el-carousel__container {
    height: 700px;
  }

  .banner-image {
    width: 100%;
    height: 100%;
  }
}
</style>