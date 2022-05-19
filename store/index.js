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
  updateCustomers(state, data){
    state.customers = state.customers.map(val=>{
      if(val.ACC_ID === data.ID){
        val.CM_CUSTOMER_ID  = data.custNum;
        val.CM_BILL_LAST = data.lName;
        val.CM_BILL_FIRST = data.fName;
        val.CM_ZIP = data.zipCode;
        val.CM_BILL_ADDRESS1 = data.add1;
        val.CM_BILL_ADDRESS2 = data.add2;
        val.CM_BILL_ADDRESS3 = data.add3;
      }
      return val
    })
  },
  setCSR(state, data){
    const ary = String(data).split('|')
    state.csr.userName = ary[0] ?? '';
    state.csr.userID = ary[1] ?? '';
    state.csr.realName = ary[2] ?? '';
  }
}
