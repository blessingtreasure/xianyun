<template>
  <div class="search-form">
    <!-- 头部tab切换 -->
    <el-row type="flex" class="search-tab">
      <span
        v-for="(item, index) in tabs"
        :key="index"
        @click="handleSearchTab(item, index)"
        :class="{active: index === currentTab}"
      >
        <i :class="item.icon"></i>
        {{item.name}}
      </span>
    </el-row>

    <el-form class="search-form-content" :rules="rules" :model="form" ref="form" label-width="80px">
      <el-form-item label="出发城市" prop="departCity">
        <!-- fetch-suggestions 返回输入建议的方法 -->
        <!-- select 点击选中建议项时触发 -->
        <el-autocomplete
          :fetch-suggestions="queryDepartSearch"
          placeholder="请搜索出发城市"
          @select="handleDepartSelect"
          class="el-autocomplete"
          :trigger-on-focus="false"
          v-model="form.departCity"
          @blur="handlDepartBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="到达城市" prop="destCity">
        <el-autocomplete
          :fetch-suggestions="queryDestSearch"
          placeholder="请搜索到达城市"
          @select="handleDestSelect"
          :trigger-on-focus="false"
          class="el-autocomplete"
          v-model="form.destCity"
          @blur="handlDestBlur"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item label="出发时间" prop="departDate">
        <!-- change 用户确认选择日期时触发 -->
        <el-date-picker
          type="date"
          placeholder="请选择日期"
          style="width: 100%;"
          @change="handleDate"
          v-model="form.departDate"
          :picker-options="pickerOptions"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        >></el-date-picker>
      </el-form-item>
      <el-form-item label>
        <el-button style="width:100%;" type="primary" icon="el-icon-search" @click="handleSubmit">搜索</el-button>
      </el-form-item>
      <div class="reverse">
        <span @click="handleReverse">换</span>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tab栏
      tabs: [
        { icon: "iconfont icondancheng", name: "单程" },
        { icon: "iconfont iconshuangxiang", name: "往返" }
      ],
      currentTab: 0,
      form: {
        departCity: "", // 出发城市
        departCode: "", // 出发城市的字母代码
        destCity: "", //到达城市
        destCode: "", // 到达城市的字母代码
        departDate: "" // 出发日期
      },
      //   出发城市下拉列表
      departCities: [],
      // 目的城市下拉列表
      destCity: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        }
      },

      rules: {
        departCity: [
          { required: true, message: "请输入城市名称", trigger: "abc" }
        ],
        destCity: [
          { required: true, message: "请输入城市名称", trigger: "abc" }
        ],
        departDate: [{ required: true, message: "请选择日期", trigger: "abc" }]
      }
    };
  },
  methods: {
    // tab切换时触发
    handleSearchTab(item, index) {},

    // 出发城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDepartSearch(value, cb) {
      if (!value) {
        this.departCities = [];
        cb([]);
        return;
      }

      // 自定义触发验证
      this.$refs.form.validateField("departCity");
      this.$axios({
        url: "/airs/city",
        method: "get",
        params: {
          name: value
        }
      }).then(res => {
        const { data } = res.data;
        const newdata = data.map(item => {
          item.value = item.name.replace("市", "");
          return item;
        });
        cb(newdata);
        this.departCities = newdata;
      });
    },

    // 出发城市下拉选择时触发
    handleDepartSelect(item) {
      this.form.departCode = item.sort;
    },
    // 当出发城市失去焦点的时候触发，默认选中第一个
    handlDepartBlur() {
      if (this.departCities.length > 0) {
        this.form.departCity = this.departCities[0].value;
        this.form.departCode = this.departCities[0].sort;
      }
    },

    // 目标城市输入框获得焦点时触发
    // value 是选中的值，cb是回调函数，接收要展示的列表
    queryDestSearch(value, cb) {
      if (!value) return;
      // 自定义触发验证
      this.$refs.form.validateField("destCity");
      this.$axios({
        url: "/airs/city",
        method: "get",
        params: {
          name: value
        }
      }).then(res => {
        const { data } = res.data;
        const newdata = data.map(item => {
          item.value = item.name.replace("市", "");
          return item;
        });
        cb(newdata);
        this.destCity = newdata;
      });
    },

    // 目标城市下拉选择时触发
    handleDestSelect(item) {
      this.form.destCode = item.sort;
    },
    // 当出发城市失去焦点的时候触发，默认选中第一个
    handlDestBlur() {
      if (this.destCity.length > 0) {
        this.form.destCity = this.destCity[0].value;
        this.form.destCode = this.destCity[0].sort;
      }
    },

    // 确认选择日期时触发
    handleDate(value) {},

    // 触发和目标城市切换时触发
    handleReverse() {
      const { departCity, departCode, destCity, destCode } = this.form;
      // 将出发和目的城市调换
      this.form.departCity = destCity;
      this.form.departCode = destCode;
      this.form.destCity = departCity;
      this.form.destCode = departCode;
    },

    // 提交表单是触发
    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 路由跳转，path指定的路径，query属性指定的问号后面的参数
          // 如果是动态参数就使用params
          this.$router.push({
            path: "/air/flights",
            query: this.form
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.search-form {
  border: 1px #ddd solid;
  border-top: none;
  width: 360px;
  height: 350px;
  box-sizing: border-box;
}

.search-tab {
  span {
    display: block;
    flex: 1;
    text-align: center;
    height: 48px;
    line-height: 42px;
    box-sizing: border-box;
    border-top: 3px #eee solid;
    background: #eee;
  }

  .active {
    border-top-color: orange;
    background: #fff;
  }

  i {
    margin-right: 5px;
    font-size: 18px;

    &:first-child {
      font-size: 16px;
    }
  }
}

.search-form-content {
  padding: 15px 50px 15px 15px;
  position: relative;

  .el-autocomplete {
    width: 100%;
  }
}

.reverse {
  position: absolute;
  top: 35px;
  right: 15px;

  &:after,
  &:before {
    display: block;
    content: "";
    position: absolute;
    left: -35px;
    width: 25px;
    height: 1px;
    background: #ccc;
  }

  &:after {
    top: 0;
  }

  &:before {
    top: 60px;
  }

  span {
    display: block;
    position: absolute;
    top: 20px;
    right: 0;
    font-size: 12px;
    background: #999;
    color: #fff;
    width: 20px;
    height: 20px;
    line-height: 18px;
    text-align: center;
    border-radius: 2px;
    cursor: pointer;

    &:after,
    &:before {
      display: block;
      content: "";
      position: absolute;
      left: 10px;
      width: 1px;
      height: 20px;
      background: #ccc;
    }

    &:after {
      top: -20px;
    }

    &:before {
      top: 20px;
    }
  }
}
</style>