<template>
  <div class="container">
    <!-- 头部导航栏 -->
    <Header></Header>
    <!-- 内容占位组件 -->
    <nuxt />
    <!-- 底部导航栏 -->
    <Footer></Footer>
  </div>
</template>
<script>
import Header from "@/components/common/header.vue";
import Footer from "@/components/common/footer.vue";
export default {
  components: {
    Header,
    Footer
  }
};
</script>
<style lang="less">
@import url("//at.alicdn.com/t/font_1783000_pma4jmshfyl.css");
html {
  font-family: "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}
ul,
li,
ol {
  list-style: none;
}
a {
  text-decoration: none;
  color: inherit;
}
a:hover {
  color: #f1a865;
}
em,
i {
  font-style: normal;
}
</style>
