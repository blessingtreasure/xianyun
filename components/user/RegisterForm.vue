<template>
  <el-form :model="form" ref="form" :rules="rules" class="form">
    <el-form-item class="form-item" prop="username">
      <el-input placeholder="用户名手机" v-model="form.username"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="captcha">
      <el-input placeholder="验证码" v-model="form.captcha">
        <template slot="append">
          <el-button @click="handleSendCaptcha">获取验证码</el-button>
        </template>
      </el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="nickname">
      <el-input placeholder="你的名字" v-model="form.nickname"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="password">
      <el-input placeholder="密码" type="password" v-model="form.password"></el-input>
    </el-form-item>

    <el-form-item class="form-item" prop="comfirmpassword">
      <el-input placeholder="确认密码" type="password" v-model="form.comfirmpassword"></el-input>
    </el-form-item>

    <el-button class="submit" type="primary" @click="handleRegSubmit">注册</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    var validapassword = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      form: {
        //   手机号码
        username: "",
        //   昵称
        nickname: "",
        //   手机验证码
        captcha: "",
        //   密码
        password: "",
        // 确认密码
        comfirmpassword: ""
      },
      //   校验规则
      rules: {
        username: [
          {
            //   required 必填的意思
            required: true,
            message: "手机号码不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur"
          }
        ],
        nickname: [
          {
            //   required 必填的意思
            min: 2,
            max: 6,
            required: true,
            message: "昵称不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur"
          }
        ],
        captcha: [
          {
            //   required 必填的意思
            required: true,
            message: "验证码不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur"
          }
        ],
        password: [
          {
            //   required 必填的意思
            required: true,
            message: "密码不能为空",
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur"
          }
        ],
        comfirmpassword: [
          {
            // 自定义校验
            validator: validapassword,
            // trigger 校验的方式，blur 为失去焦点的时候验证
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //   发送验证码
    handleSendCaptcha() {
      // 手机号码为空的时候，return
      if (this.form.username === "") return;
      this.$store.dispatch("user/captchas", this.form.username).then(res => {
        this.$message.success("发送成功，验证码为：" + res.data.code);
      });
    },
    //   提交注册,实现注册完之后自动登录
    handleRegSubmit() {
      this.$store.dispatch("user/regesiter", this.form).then(res => {
        this.$message.success("登录成功，欢迎回来" + res.data.user.nickname);
        this.$router.replace("/");
      });
    }
  }
};
</script>

<style lang="less" scoped>
.form {
  padding: 25px;
}

.form-item {
  margin-bottom: 20px;
}

.form-text {
  font-size: 12px;
  color: #409eff;
  text-align: right;
  line-height: 1;
}

.submit {
  width: 100%;
  margin-top: 10px;
}
</style>