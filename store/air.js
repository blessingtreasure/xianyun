function state() {
  return {
    //   历史查询
    searchList: [],
    // 航班订单信息
    filghtsData: {
      seat_infos: {}
    },
    // 用户订单数据
    orderData: {

    }
  }
}
// 同步修改state数据
const mutations = {
  setSearch(state, data) {
    state.searchList.unshift(data)
    if (state.searchList.length > 5) {
      // 只保留数组前五位
      state.searchList.length = 5;
    }
  },
  // 保存订单总数据
  setFilghtData(state, data) {
    state.filghtsData = data;
  },
  // 保存用户订单的数据
  setOrderData(state, data) {
    state.orderData = data;
  }
}
export default {
  state,
  mutations
}
