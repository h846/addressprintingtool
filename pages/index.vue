/* eslint-disable no-console */
<template>
  <v-row justify="center">
    <v-col id="custtable" cols="12">
      <v-card>
        <v-card-text>
          <v-row justify="center">
            <v-col cols="3">
              <v-text-field
                v-model="cust_id"
                outlined
                @keyup.enter="custSearch()"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12">
              <v-simple-table v-show="showTable">
                <template #default>
                  <thead>
                    <tr>
                      <th>顧客番号</th>
                      <th>顧客名</th>
                      <th>住所</th>
                      <th>削除</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(item, index) in customers" :key="index">
                      <td>{{ item.CUST_NUM }}</td>
                      <td>
                        {{ item.CUST_NAME }}
                      </td>
                      <td>
                        {{ item.Add1 + item.Add2 + item.Add3 }}
                      </td>
                      <td>
                        <v-btn @click="removeCust(item.ID)">削除</v-btn>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
              <div v-show="showError">
                この番号の顧客は見つかりませんでした。
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="12">
      <Print :cust-list="customers" @printing="printing()" />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      cust_id: '',
      showTable: false,
      showError: false,
      customers: [],
      csr: { id: null, userName: null, name: null },
    }
  },
  mounted() {
    this.getCSR()
    this.getUnPrintedList()
    console.log(this.$dayjs().format('YYYY-MM-DD'))
  },
  methods: {
    async getUnPrintedList() {
      await axios
        .get('http://lejnet/api/accdb', {
          params: {
            db: 'CSNET/test/accapi/LabelPrint.accdb',
            table: 'CUSTLABELforFutou',
          },
        })
        .then((res) => {
          const data = res.data.filter((val) => {
            return val.PRINT_FLAG === 0
          })
          this.showTable = true
          if (data.length > 0) {
            this.customers = []
            this.customers.push(...data)

            console.log(this.customers)
          } else {
            this.customers = []
            this.showTable = false
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async custSearch() {
      this.showTable = true
      // Customer Search and add Record to DB
      await axios
        .post('http://lejnet/api/oracle/customer', {
          cust_id: this.cust_id,
        })
        .then((res) => {
          console.log(res.data)
          this.showError = false
          if (res.data.length <= 0) {
            this.showError = true
            return
          }
          const cust = res.data[0]
          const custHash = {}
          custHash.CUST_NUM = this.trim(cust.CM_CUSTOMER_ID)
          custHash.CUST_NAME = this.trim(
            `${cust.CM_BILL_LAST} ${cust.CM_BILL_FIRST}`
          )

          custHash.POSTCODE = this.trim(cust.CM_ZIP)
          custHash.Add1 = this.trim(cust.CM_BILL_ADDRESS1)
          custHash.Add2 = this.trim(cust.CM_BILL_ADDRESS2)
          custHash.Add3 = this.trim(cust.CM_BILL_ADDRESS3)
          custHash.Add4 = this.trim(cust.CM_BILL_ADDRESS4)
          custHash.INPUT_CSR = this.csr.name
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
            .then((res) => {
              console.log(res.status)
            })
            .catch((e) => {
              console.log(e)
            })

          this.getUnPrintedList()
          console.log(this.customers)
        })
    },
    removeCust(id) {
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
          const ary = String(res.data).split('|')
          this.csr.id = ary[0] || ''
          this.csr.userName = ary[1] || ''
          this.csr.name = ary[2] || ''

          console.log(this.csr)
        })
    },
  },
}
</script>
<style>
@media print {
  #custtable {
    display: none;
  }
}
</style>
