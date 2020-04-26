<template>
  <div class="container">
    <div class="main">
      <div class="pay-title">
        支付总金额
        <span class="pay-price">￥ {{Number($store.state.air.orderData.totalPrice).toFixed(2)}}</span>
      </div>
      <div class="pay-main">
        <h4>微信支付</h4>
        <el-row type="flex" justify="space-between" align="middle" class="pay-qrcode">
          <div class="qrcode">
            <!-- 二维码 -->
            <canvas id="qrcode-stage"></canvas>
            <p>请使用微信扫一扫</p>
            <p>扫描二维码支付</p>
          </div>
          <div class="pay-example">
            <img src="http://157.122.54.189:9093/images/wx-sweep2.jpg" alt />
          </div>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
// 导入二维码的包
import QRcode from "qrcode";
export default {
  mounted() {
    setTimeout(async () => {
      const id = this.$route.query.id;
      const { token, user } = this.$store.state.user.userInfo;
      // 请求二维码
      await this.$axios({
        url: `airorders/${id}`,
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        }
      }).then(res => {
        const { payInfo } = res.data;
        this.detail = res.data;
        const canvas = document.querySelector("#qrcode-stage");
        // 第一个参数canvas节点元素
        // 第二个是生成二维码的链接
        QRcode.toCanvas(canvas, payInfo.code_url, {
          width: 200
        });
      });
    }, 20);
    //   轮询获取订单的支付状态
    this.timer = setInterval(() => {
      this.$axios({
        url: "/airorders/checkpay",
        method: "post",
        headers: {
          Authorization: `Bearer ` + this.$store.state.user.userInfo.token
        },
        data: {
          id: this.detail.id, //订单id
          nonce_str: this.detail.price, //订单金额
          out_trade_no: this.detail.orderNo //订单编号
        }
      }).then(res => {
        const { statusTxt, trade_state } = res.data;
        if (trade_state === "SUCCESS") {
          this.$alert(
            `<strong> 
            <i class='iconfont icon-chenggong'  style="color:#57c22d;margin-right:10px"></i>恭喜你，订单支付成功！
            </strong>`,
            "订单支付结果",
            {
              dangerouslyUseHTMLString: true
            }
          );
          clearInterval(this.timer);
        }
      });
    }, 3000);
  },
  data() {
    return {
      detail: "",
      timer: {}
    };
  },
  destroyed() {
    //   当组件销毁时，清除定时器
    clearInterval(this.timer);
  }
};
</script>

<style scoped lang="less">
.container {
  background: #f5f5f5;
  padding: 30px 0;

  .main {
    width: 1000px;
    margin: 0 auto;

    .pay-title {
      text-align: right;
      span {
        font-size: 28px;
        color: orangered;
      }
    }

    .pay-main {
      background: #fff;
      margin-top: 10px;
      border-top: 5px orange solid;
      padding: 30px;

      h4 {
        font-size: 28px;
        font-weight: normal;
        margin-bottom: 10px;
      }

      .pay-qrcode {
        padding: 0 80px;
      }

      .qrcode {
        border: 1px #ddd solid;
        padding: 15px;
        height: fit-content;

        #qrcode-stage {
          width: 200px;
          height: 200px;
          margin-bottom: 10px;
        }

        p {
          line-height: 2;
          text-align: center;
        }
      }
    }
  }
}
</style>