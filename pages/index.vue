/* eslint-disable no-console */
<template>
  <v-row justify="center">
    <v-col id="custtable" cols="12">
      <v-card width="800" class="mx-auto" elevation="5">
        <v-card-text>
          <v-row justify="center">
            <v-col cols="12">
              <v-textarea
                v-model="cust_id"
                label="顧客番号を入力してENTER。改行区切りで複数の番号を入力できます。"
                outlined
                clearable
                :error="showError"
                :error-messages="errMsg"
                @keyup.enter="custDataSplit()"
                @keydown.enter.prevent
              ></v-textarea>
            </v-col>
          </v-row>
          <v-row justify="center">
            <v-col cols="12">
              <v-simple-table v-show="showTable">
                <template #default>
                  <thead>
                    <tr>
                      <th>顧客番号</th>
                      <th>顧客名</th>
                      <th>住所</th>
                      <th>編集</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in customers" :key="index">
                      <td>{{ item.CM_CUSTOMER_ID }}</td>
                      <td>{{ item.CM_BILL_LAST }} {{ item.CM_BILL_FIRST }}</td>
                      <td>
                        {{ item.CM_BILL_ADDRESS1 + item.CM_BILL_ADDRESS2 }}
                      </td>
                      <td>
                        <!-- EDIT FORM -->
                        <the-editor :cust-id="item.ACC_ID" />
                        <v-icon @click="removeCust(item.ACC_ID)">
                          mdi-delete
                        </v-icon>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="４">
      <v-btn color="red darken-2" width="200" dark to="/labelPrint" nuxt
        >ラベル印刷</v-btn
      >

      <a href="http://lejnet/csapp/label-print/print_label.pdf" target="_blank"
        >印刷方法</a
      >
    </v-col>
    <v-col cols="４">
      <v-btn color="red darken-2" width="200" dark to="ordFormPrint" nuxt
        >オーダーフォーム印刷</v-btn
      >

      <a
        href="http://lejnet/csapp/label-print/print_orderform.pdf"
        target="_blank"
        >印刷方法</a
      >
    </v-col>
    <v-col cols="４">
      <v-btn color="red darken-2" width="200" dark to="kaku2print" nuxt
        >角2封筒印刷</v-btn
      >

      <a href="" target="_blank">印刷方法</a>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
import TheEditor from '~/components/TheEditor.vue'
export default {
  components: { TheEditor },
  data() {
    return {
      cust_id: '',
      showTable: false,
      showError: false,
      errMsg: null,
    }
  },
  computed: {
    customers() {
      return this.$store.state.customers
    },
  },
  mounted() {
    this.getCSR()
    this.getUnPrintedList()
    // console.log(this.$dayjs().format('YYYY-MM-DD'))
  },

  methods: {
    async getUnPrintedList() {
      this.$store.commit('toggleLoading', true)
      this.showTable = true

      let accdata = await axios.get('http://lejnet/api/accdb', {
        params: {
          db: 'CSNET/test/accapi/LabelPrint.accdb',
          table: 'CUSTLABELforFutou',
        },
      })

      accdata = accdata.data.filter((val) => {
        return val.PRINT_FLAG === 0
      })

      const oradata = []
      for (const val of accdata) {
        const data = await this.getCustInfo(val.CUST_NUM)
        data[0].ACC_ID = val.ID
        oradata.push(...data)
      }

      console.log(oradata)

      this.$store.commit('setCustomers', [...oradata])
      this.$store.commit('toggleLoading', false)
    },
    getCustInfo(custNum) {
      // Get it from ORACLE
      return new Promise((resolve, reject) => {
        axios
          .post('http://lejnet/api/oracle/customer', {
            cust_id: custNum,
          })
          .then((res) => {
            resolve(res.data)
          })
          .catch((err) => {
            reject(err)
          })
      })
    },
    validation(val, custid) {
      this.showError = false
      this.errMsg = null
      if (val.data.length <= 0) {
        this.showError = true
        this.errMsg = '無効な顧客番号です。'
        return false
      } else if (this.cust_id === '') {
        this.showError = true
        this.errMsg = '顧客番号を入力してください'
        return false
      } else if (/\D+/.test(parseInt(custid))) {
        this.showError = true
        this.errMsg = '半角数字を入力してください'
        return false
      }
    },
    custDataSplit() {
      const ary = this.cust_id.split(/\n/)

      for (const i of ary) {
        this.custSearch(i)
      }
    },
    async custSearch(custNum) {
      const cust_id = parseInt(custNum)

      this.showTable = true
      this.$store.commit('toggleLoading', true)
      // Customer Search and add Add to DB
      await axios
        .post('http://lejnet/api/oracle/customer', {
          cust_id,
        })
        .then((res) => {
          // Form Varidation
          if (this.validation(res, cust_id) === false) {
            this.$store.commit('toggleLoading', false)
            return
          }
          console.log(res.data)
          const cust = res.data[0]
          const custHash = {}
          custHash.CUST_NUM = this.trim(cust.CM_CUSTOMER_ID)
          custHash.CUST_NAME = this.trim(
            `${cust.CM_BILL_LAST} ${cust.CM_BILL_FIRST}`
          )

          custHash.INPUT_CSR = this.$store.state.csr.realName
          custHash.INPUT_DATE = this.$dayjs().format('YYYY-MM-DD HH:mm:ss')
          custHash.PRINT_FLAG = 0

          const keys = []
          const vals = []

          for (const i in custHash) {
            keys.push(i)
            vals.push(`'${custHash[i]}'`)
          }

          const db = 'CSNET/test/accapi/LabelPrint.accdb'
          const sql = `INSERT INTO CUSTLABELforFutou(${keys.join(
            ','
          )}) VALUES(${vals.join(',')})`
          // console.log('SQL: ' + sql)
          axios
            .post('http://lejnet/api/accdb', {
              db,
              sql,
            })
            .then(() => {
              // console.log(res.status)
              this.getUnPrintedList()
              this.$store.commit('toggleLoading', false)
            })
            .catch((e) => {
              console.log(e)
            })

          console.log(this.customers)
        })
    },
    removeCust(id) {
      this.$store.commit('toggleLoading', true)
      const db = 'CSNET/test/accapi/LabelPrint.accdb'
      const sql = `DELETE FROM CUSTLABELforFutou WHERE ID = ${id}`
      axios
        .post('http://lejnet/api/accdb', {
          db,
          sql,
        })
        .then((res) => {
          this.getUnPrintedList()
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.$store.commit('toggleLoading', false)
        })
    },
    trim(str) {
      return str === 'null' ? '' : String(str).trim()
    },
    async getCSR() {
      await axios
        .get('http://lejnet/csnet/ORDER_TOOL/user_auth.asp', {
          withCredentials: true,
        })
        .then((res) => {
          this.$store.commit('setCSR', res.data)
        })
    },
  },
}
</script>
<style>
@media print {
  #custtable,
  .label-prt,
  .form-prt {
    display: none !important;
  }
}

a {
  display: inline-block;
  text-decoration: none;
  margin-top: 2px;
  font-size: 1rem;
  font-weight: bold;
}
</style>
