<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <div></div>

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <flightsItem v-for="(item, index) in flights" :key="index" :data="item" />
        <!-- 分页 -->
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[5, 10, 15, 20]"
          :page-size="5"
          layout="sizes, prev, pager, next, jumper, total"
          :total="total"
        ></el-pagination>
      </div>

      <!-- 侧边栏 -->
      <div class="aside">
        <!-- 侧边栏组件 -->
      </div>
    </el-row>
  </section>
</template>

<script>
import moment from "moment";
import FlightsListHead from "@/components/air/flightsListHead.vue";
import flightsItem from "@/components/air/flightsItem.vue";
export default {
  components: {
    FlightsListHead,
    flightsItem
  },
  mounted() {
    //   获取航班信息
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      // 航班总数据
      this.dataList = res.data.flights;
      this.total = res.data.total;
      // 当前页航班列表数据
      this.flights = this.dataList.slice(0, 5);
    });
  },
  data() {
    return {
      // 航班总数据
      dataList: [],
      //   航班列表数据
      flights: [],
      currentPage: 1,
      total: 0,
      pageSize: 5
    };
  },
  methods: {
    //   切换页面条数
    handleSizeChange(val) {
      this.flights = this.dataList.slice(0, val);
    },
    // 点击跳转到当前页
    handleCurrentChange(val) {
      // 起始值
      const start = (val - 1) * this.pageSize;
      // 结束值
      const end = val * this.pageSize;
      // 当前页航班列表数据
      this.flights = this.dataList.slice(start, end);
    }
  }
};
</script>

<style lang="less" scoped>
.contianer {
  width: 1000px;
  margin: 20px auto;
}

.flights-content {
  width: 745px;
  font-size: 14px;
}

.aside {
  width: 240px;
}
</style>