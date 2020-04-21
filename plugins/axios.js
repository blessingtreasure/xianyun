import {
  Message
} from "element-ui";

// axios 的响应拦截错误的响应，err.response

export default (nuxt) => {
  nuxt.$axios.onError(err => {
    const {
      statusCode,
      message
    } = err.response.data;
    if (statusCode == 400) {
      Message.warning({
        message
      });
    }
  })

}
