export const state = () => ({
  isLoading: false,
  customers:[],
  csr:{ userName: null, userID: null, realName: null }
})

export const getters = {
  customers: state => state.customers
}

export const mutations = {
  toggleLoading(state, boolean) {
    state.isLoading = boolean
  },
  setCustomers(state, data){
    state.customers = data;
  },
  setCSR(state, data){
    const ary = String(data).split('|')
    state.csr.userName = ary[0] ?? '';
    state.csr.userID = ary[1] ?? '';
    state.csr.realName = ary[2] ?? '';
  }
}
