function state() {
  return {
    //   历史查询
    searchList: []
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
  }
}
export default {
  state,
  mutations
}
