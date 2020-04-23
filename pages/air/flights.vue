<template>
  <section class="contianer">
    <el-row type="flex" justify="space-between">
      <!-- 顶部过滤列表 -->
      <div class="flights-content">
        <!-- 过滤条件 -->
        <flightsFilters :flightsData="dataList" @getfilter="getfilter" />

        <!-- 航班头部布局 -->
        <FlightsListHead />

        <!-- 航班信息 -->
        <flightsItem v-for="(item, index) in pageList" :key="index" :data="item" />
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
import flightsFilters from "@/components/air/flightsFilters.vue";
export default {
  components: {
    FlightsListHead,
    flightsItem,
    flightsFilters
  },
  mounted() {
    //   获取航班信息
    this.$axios({
      url: "/airs",
      params: this.$route.query
    }).then(res => {
      // 航班总数据(里面包含了info,flights,total,options属性)
      this.dataList = res.data;
      //  当前页航班列表数据( 因为赋值是引用类型内存地址是一样的所以需要拷贝一份)
      this.flightsData = { ...res.data };
      //   总条数
      this.total = res.data.total;
    });
  },
  computed: {
    pageList() {
      // 起始值
      const start = (this.pageIndex - 1) * this.pageSize;
      // 结束值
      const end = this.pageIndex * this.pageSize;
      // 当前页航班列表数据
      return this.flightsData.flights.slice(start, end);
    }
  },
  data() {
    return {
      // 航班总数据
      dataList: {
        info: {},
        flights: [],
        options: {
          company: {}
        }
      },
      //   航班列表数据
      flightsData: {
        flights: []
      },
      currentPage: 1,
      total: 0,
      pageSize: 5,
      pageIndex: 1
    };
  },
  methods: {
    //   获取过滤回来的数据
    getfilter(values) {
      this.flightsData.flights = values;
      this.total = values.length;
    },
    //   切换页面条数
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageIndex = 1;
    },
    // 点击跳转到当前页
    handleCurrentChange(val) {
      this.pageIndex = val;
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