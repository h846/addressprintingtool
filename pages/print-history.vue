/* eslint-disable no-console */
<template>
  <v-row>
    <v-col cols="12">
      <v-card>
        <v-card-title>
          ラベル印刷履歴
          <v-spacer></v-spacer>
          <v-text-field
            v-model="search"
            append-icon="mdi-magnify"
            label="Search"
            single-line
            hide-details
          ></v-text-field>
        </v-card-title>
        <v-data-table :headers="headers" :items="cust_list" :search="search">
          <template #[`item.INPUT_CSR`]="{ item }">
            {{ item.PRINT_CSR + ' ' + item.INPUT_CSR }}
          </template>
        </v-data-table>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios'
export default {
  name: 'IndexPage',
  async asyncData() {
    let res = await axios.get('http://lejnet/api/accdb', {
      params: {
        db: 'CSNet/test/accapi/LabelPrint.accdb',
        table: 'CUSTLABELforFutou',
      },
    })

    res = res.data.filter((val) => {
      return val.PRINT_FLAG === 1
    })

    return {
      cust_list: res,
    }
  },
  data() {
    return {
      search: '',
      headers: [
        { text: '顧客番号', value: 'CUST_NUM' },
        { text: '顧客名', value: 'CUST_NAME' },
        { text: '入力者', value: 'INPUT_CSR' },
        { text: '入力日', value: 'INPUT_DATE' },
        { text: '印刷日', value: 'PRINT_DATE' },
      ],
    }
  },
  mounted() {
    console.log(this.$dayjs().format('YYYY-MM-DD'))
  },
  methods: {},
}
</script>
