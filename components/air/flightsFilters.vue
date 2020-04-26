<template>
  <div class="filters">
    <el-row type="flex" class="filters-top" justify="space-between" align="middle">
      <el-col :span="8">
        单程：
        {{flightsData.info.departCity}} - {{flightsData.info.destCity}}
        /
        {{moment(flightsData.info.departDate).format('YYYY-MM-DD')}}
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airport" placeholder="起飞机场">
          <el-option
            v-for="(item,index) in flightsData.options.airport"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="flightTimes" placeholder="起飞时间">
          <el-option
            v-for="(item,index) in flightsData.options.flightTimes"
            :key="index"
            :label="`${item.from}:00 - ${item.to}:00`"
            :value="`${item.from},${item.to}`"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="company" placeholder="航空公司">
          <el-option
            v-for="(item,index) in flightsData.options.company"
            :key="index"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select size="mini" v-model="airSize" placeholder="机型">
          <el-option
            v-for="(item,index) in airSizeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
    </el-row>
    <div class="filter-cancel">
      筛选：
      <el-button type="primary" round plain size="mini" @click="handleFiltersCancel">撤销</el-button>
    </div>
    <!-- 设置空标签，实现computed 过滤函数，并设置隐藏 -->
    <div v-show="false">{{myfilters}}</div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  props: {
    //   接收父组件传递的值
    flightsData: {
      type: Object,
      default: {}
    }
  },
  mounted() {
    console.log(this.flightsData);
  },
  data() {
    return {
      airport: "", // 机场
      flightTimes: "", // 出发时间
      company: "", // 航空公司
      airSize: "", //飞机尺寸
      airSizeList: [
        { label: "大", value: "L" },
        { label: "中", value: "M" },
        { label: "小", value: "S" }
      ],
      moment
    };
  },
  computed: {
    myfilters() {
      //   // 筛选条件
      //   const filterList = [
      //     // 航空公司
      //     { key: "airline_name", value: this.company },
      //     // 机型大小
      //     { key: "plane_size", value: this.airSize },
      //     // 起飞时间
      //     { key: "dep_time", value: this.flightTimes },
      //     // 起飞机场
      //     { key: "org_airport_name", value: this.airport }
      //   ];
      //   // 1.首先，把用户有选择的筛选取出来
      //   const hasfilter = filterList.filter(item => {
      //     return item.value;
      //   });
      //   // 2.把有选择的进行综合过滤
      //   // console.log(hasfilter);
      //   const arr = this.flightsData.flights.filter(item => {
      //     //   every 如果该函数对每一项都为true时,则返回true。
      //     const res = hasfilter.every(v => {
      //       return item[v.key] === v.value;
      //     });
      //     return res;
      //   });
      const arr = this.flightsData.flights.filter(item => {
        //   假设所有条件都满足，只要其中一个不满足，flag即为false
        let flag = true;
        if (this.airport && item.org_airport_name !== this.airport) {
          flag = false;
        }
        if (this.flightTimes) {
          const start = Number(this.flightTimes.split(",")[0]);
          const end = Number(this.flightTimes.split(",")[1]);
          if (
            start > +item.dep_time.split(":")[0] ||
            +item.dep_time.split(":")[0] > end
          ) {
            flag = false;
          }
        }
        if (this.company && item.airline_name !== this.company) {
          flag = false;
        }
        if (this.airSize && item.plane_size !== this.airSize) {
          flag = false;
        }
        // 返回满足条件的
        return flag;
      });
      this.$emit("getfilter", arr);
    }
  },
  methods: {
    // 选择机场时候触发
    handleAirport(value) {
      const arr = this.flightsData.flights.filter(item => {
        return item.org_airport_name === value;
      });
      this.$emit("getfilter", arr);
    },

    // 选择出发时间时候触发
    handleFlightTimes(value) {
      const start = Number(value.split(",")[0]);
      const end = Number(value.split(",")[1]);
      const arr = this.flightsData.flights.filter(item => {
        return (
          start <= +item.dep_time.split(":")[0] &&
          +item.dep_time.split(":")[0] <= end
        );
      });
      this.$emit("getfilter", arr);
    },

    // 撤销条件时候触发
    handleFiltersCancel() {
      // 清空筛选条件
      this.airport = ""; // 机场
      this.flightTimes = ""; // 出发时间
      this.company = ""; // 航空公司
      this.airSize = ""; //飞机尺寸
      this.$emit("getfilter", this.flightsData.flights);
    }
  }
};
</script>

<style lang="less" scoped>
.filters {
  margin-bottom: 20px;
}

.filters-top {
  > div {
    /deep/ .el-select {
      margin-left: 10px;
    }
  }
}

.filter-cancel {
  margin-top: 10px;
}
</style>