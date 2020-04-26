<template>
  <div class="main">
    <div class="air-column">
      <span v-show="false">{{getFilghtsData}}</span>
      <h2>剩机人</h2>
      <el-form class="member-info" :model="form" :rules="rules" ref="form">
        <div class="member-info-item" v-for="(item,index) in form.users" :key="index">
          <el-form-item label="乘机人" prop="users" :show-message="false" inline-message>
            <el-input placeholder="姓名" class="input-with-select" v-model="item.username"></el-input>
          </el-form-item>

          <el-form-item label="证件类型" prop="users">
            <el-input placeholder="证件号码" class="input-with-select" v-model="item.id">
              <el-select slot="prepend" value="1" placeholder="请选择">
                <el-option label="身份证" value="1" :checked="true"></el-option>
              </el-select>
            </el-input>
          </el-form-item>

          <span class="delete-user" @click="handleDeleteUser(index)">-</span>
        </div>
      </el-form>

      <el-button class="add-member" type="primary" @click="handleAddUsers">添加乘机人</el-button>
    </div>

    <div class="air-column">
      <h2>保险</h2>
      <div>
        <div class="insurance-item" v-for="(item,index) in insurances" :key="index">
          <el-checkbox
            checked
            :label="`${item.type}：￥${item.price}/份×1  最高赔付${item.compensation}`"
            border
            @change="handelchecked(item.id)"
          ></el-checkbox>
        </div>
      </div>
    </div>

    <div class="air-column">
      <h2>联系人</h2>
      <div class="contact">
        <el-form label-width="80px" :model="form" :rules="rules" ref="form2">
          <el-form-item label="姓名" prop="contactName">
            <el-input v-model="form.contactName"></el-input>
          </el-form-item>

          <el-form-item label="手机" prop="contactPhone">
            <el-input placeholder="请输入内容" v-model="form.contactPhone">
              <template slot="append">
                <el-button @click="handleSendCaptcha">发送验证码</el-button>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item label="验证码" prop="captcha">
            <el-input v-model="form.captcha"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="warning" class="submit" @click="handleSubmit">提交订单</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  mounted() {
    const { id, seat_xid } = this.$route.query;
    this.$axios({
      url: `/airs/${id}`,
      params: {
        seat_xid
      }
    }).then(res => {
      // 保存订单详情
      this.detail = res.data;
      // 将订单详情信息保存到，vuex中
      this.$store.commit("air/setFilghtData", this.detail);
      const { insurances } = res.data;
      this.insurances = insurances;
      this.form.insurances = insurances.map(item => {
        return item.id;
      });
    });
  },
  // 动态监测表单中的数据，一旦修改，会触发vuex中的数据更新
  computed: {
    getFilghtsData() {
      // 如果请求还没回来，直接返回为0
      if (!this.detail.seat_infos) {
        return 0;
      }
      // 总价
      let total = 0;
      // 保险价格
      let insurancePrice = 0;
      // 成人总票价=单价*数量
      let memberPrice =
        this.detail.seat_infos.org_settle_price * this.form.users.length;

      // 保险总价
      this.form.insurances.forEach(item => {
        this.detail.insurances.forEach(v => {
          if (item == v.id) {
            insurancePrice += v.price;
          }
        });
      });
      // 加机建＋燃油
      //  this.detail.airport_tax_audlet;
      // 最终价格
      total = insurancePrice + memberPrice + this.detail.airport_tax_audlet;
      // 将数据保存到vuex
      this.$store.commit("air/setOrderData", {
        totalPrice: total,
        member: this.form.users.length
      });
      return total;
    }
  },
  data() {
    // 自定义检验
    var validateuser = (rules, value, callback) => {
      // 假设验证是通过的， 如果最后的验证通过就调用callback
      let valid = true;
      // v是一个对象,比如{username: "a", id: "123"}

      value.forEach(item => {
        // 如果验证有一个不通过，后面的判断就没必要再执行
        if (!valid) return;
        if (item.username.trim() === "") {
          valid = false;
          return callback(new Error("请填写姓名"));
        }
        if (item.id.trim() === "") {
          valid = false;
          return callback(new Error("请填写姓名"));
        }
      });
      // 如果验证全部通过
      if (valid) {
        callback();
      }
    };
    return {
      detail: "",
      form: {
        users: [{ username: "", id: "" }], // 乘机人
        insurances: [], // 选中的保险id
        contactName: "", // 联系人名字
        contactPhone: "", // 联系人电话
        captcha: "", // 验证码这个参数接口文档漏掉了

        invoice: false, // 默认不需要发票
        seat_xid: "", // 座位id
        air: "" // 航班id
      },
      // 保险id
      insurances: [],
      // 验证规则
      rules: {
        users: [{ validator: validateuser, trigger: "blur" }],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请输入手机号码", trigger: "blur" }
        ],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      }
    };
  },
  methods: {
    // 添加乘机人
    handleAddUsers() {
      this.form.users.push({ username: "", id: "" });
    },

    // 移除乘机人
    handleDeleteUser(index) {
      this.form.users.splice(index, 1);
    },

    // 发送手机验证码
    handleSendCaptcha() {
      if (this.form.contactPhone) {
        this.$store
          .dispatch("user/captchas", this.form.contactPhone)
          .then(res => {
            const { code } = res.data;
            this.$message.success("验证码：" + code);
          });
      } else {
        this.$confirm("手机号码不能为空", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "warning"
        });
        return;
      }
    },
    // 处理是否选中航空保险
    handelchecked(id) {
      // indexof,查找数组中是否有该元素，有则，返回该元素的索引位置，没有则返回-1；
      const index = this.form.insurances.indexOf(id);
      //   有id就删除，没有id就添加
      if (index > -1) {
        this.form.insurances.splice(index, 1);
      } else {
        this.form.insurances.push(id);
      }
    },
    // 提交订单
    handleSubmit() {
      this.form.seat_xid = this.$route.query.seat_xid;
      this.form.air = Number(this.$route.query.id);
      // 表单验证
      this.$refs.form.validate(valid => {
        this.$refs.form2.validate(valid2 => {
          if (valid && valid2) {
            this.$axios({
              url: "/airorders",
              method: "post",
              headers: {
                // 这里千万要注意Bearer 后面必须要有一个空格（基于JWT标准）
                Authorization: `Bearer ` + this.$store.state.user.userInfo.token
              },
              data: this.form
            }).then(res => {
              this.$message.success("提交订单成功！");

              const {
                data: { id }
              } = res.data;
              // console.log(res);
              // 订单跳转
              this.$router.push({
                path: "/air/pay",
                query: {
                  id
                }
              });
            });
          }
        });
      });
    }
  }
};
</script>

<style scoped lang="less">
.air-column {
  border-bottom: 1px #ddd dashed;
  padding-bottom: 20px;
  margin-bottom: 20px;
}

.air-column h2 {
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: normal;
}

/deep/ .el-select .el-input {
  width: 130px;
}

.input-with-select {
  width: 590px;
}

.input-with-select /deep/ .el-input-group__prepend {
  background-color: #fff;
}
.member-info /deep/ .el-form-item {
  margin-bottom: 0;
}

.member-info-item {
  border-bottom: 1px #eee dashed;
  padding-bottom: 20px;
  position: relative;

  &:first-child {
    .delete-user {
      display: none;
    }
  }
}

.add-member {
  margin-top: 20px;
}

.delete-user {
  display: block;
  background: #ddd;
  width: 16px;
  height: 16px;
  font-size: 14px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  cursor: pointer;
  border-radius: 50px;
  position: absolute;
  right: -30px;
  top: 50%;
}

.insurance {
  > div {
    margin-top: 10px;
  }
}

.insurance-item {
  margin-bottom: 20px;
}

.contact {
  /deep/ .el-input {
    width: 50%;
  }
}

.submit {
  margin: 50px auto;
  display: block;
  width: 250px;
  height: 50px;
}
</style>