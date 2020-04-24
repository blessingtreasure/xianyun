<template>
  <div class="aside">
    <div class="statement">
      <el-row type="flex" justify="space-between" class="statement-list">
        <el-col :span="8">
          <i class="iconfont iconweibiaoti-_huabanfuben" style="color:#409EFF;"></i>
          <span>航协认证</span>
        </el-col>
        <el-col :span="8">
          <i class="iconfont iconbaozheng" style="color:green;"></i>
          <span>出行保证</span>
        </el-col>
        <el-col :span="8">
          <i class="iconfont icondianhua" style="color:#409EFF;"></i>
          <span>7x24</span>
        </el-col>
      </el-row>
      <p class="service-tel">免费客服电话：4006345678转2</p>
    </div>

    <div class="history">
      <h5>历史查询</h5>
      <div v-for="(item,index) in $store.state.air.searchList" :key="index">
        <el-row type="flex" justify="space-between" align="middle" class="history-item">
          <div class="air-info">
            <div class="to-from">{{item.departCity}} - {{item.destCity}}</div>
            <p>{{item.departDate}}</p>
          </div>
          <span @click="handleSelect(item)">选择</span>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  methods: {
    handleSelect(item) {
      const myitem = { ...item };
      const today = moment().format("YYYY-MM-DD");
      //  全局替换， 把横杠去掉
      //   当天的时间(20200424)
      const todayNumber = today.replace(/-/g, "");
      //   点击item 的时间(20200430)
      const departDateNumber = item.departDate.replace(/-/g, "");
      // 进行比较
      // 如果item 的时间比当天的时间大，把时间改为今天
      if (departDateNumber < todayNumber) {
        myitem.departDate = today;
      }
      //   将路由参数修改（当路由参数修改时，触发组件更新，去到filghts页面）
      this.$router.push({
        url: "/air/flights",
        query: myitem
      });
    }
  }
};
</script>

<style lang="less" scoped>
.statement {
  border: 1px #ddd solid;

  .statement-list {
    padding: 10px 0;
    > div {
      text-align: center;
      i {
        display: block;
        font-size: 40px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .service-tel {
    height: 32px;
    line-height: 32px;
    padding: 0 10px;
    background: #f6f6f6;
    font-size: 14px;
  }
}

.history {
  border: 1px #ddd solid;
  padding: 10px;
  margin-top: 10px;

  h5 {
    font-size: 16px;
    font-weight: normal;
    padding-bottom: 10px;
    border-bottom: 1px #eee solid;
  }

  .history-item {
    padding: 10px 0;
    font-size: 14px;
    border-bottom: 1px #eee solid;

    &:last-child {
      border: none;
    }

    .to-from {
      margin-bottom: 5px;
    }

    p {
      font-size: 12px;
      color: #666;
    }

    span {
      color: #fff;
      display: block;
      padding: 2px 10px;
      background: orange;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    }
  }
}
</style>