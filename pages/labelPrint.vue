<template>
  <div class="sheets">
    <div v-for="(item, index) in custList" :key="index" class="sheet">
      <div>〒{{ item.CM_ZIP_KEY }}</div>
      <div>{{ item.CM_BILL_ADDRESS1 + item.CM_BILL_ADDRESS2 }}</div>
      <div v-if="item.CM_BILL_ADDRESS3 !== 'null'">
        {{ item.CM_BILL_ADDRESS3 }}
      </div>
      <div v-if="item.CM_BILL_ADDRESS4 !== 'null'">
        {{ item.CM_BILL_ADDRESS4 }}
      </div>
      <div class="mt-3">
        {{ item.CM_BILL_LAST + ' ' + item.CM_BILL_FIRST }} 様
      </div>
      <div>{{ item.CM_CUSTOMER_ID }}</div>
    </div>

    <div class="mt-10" style="text-align: center">
      <v-btn
        color="red darken-2"
        dark
        x-large
        width="700"
        @click="printCompleated()"
        >印刷済みにする</v-btn
      >
    </div>
    <div class="mt-10" style="text-align: center">
      <v-btn color="red darken-2" dark x-large width="700" @click="goHome()"
        >トップページに戻る</v-btn
      >
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  computed: {
    custList() {
      return this.$store.state.customers
    },
    csr() {
      return this.$store.state.csr
    },
  },
  mounted() {
    window.print()
  },
  methods: {
    goHome() {
      this.$router.push('/')
    },
    async printCompleated() {
      this.$store.commit('toggleLoading', true)
      const db = 'CSNET/test/accapi/LabelPrint.accdb'
      const sql =
        "UPDATE CUSTLABELforFutou SET PRINT_FLAG = 1, PRINT_CSR = '" +
        this.csr.userID +
        "',PRINT_DATE='" +
        this.$dayjs().format('YYYY-MM-DD HH:mm:ss') +
        "' WHERE PRINT_FLAG = 0"
      await axios
        .post('http://lejnet/api/accdb', {
          db,
          sql,
        })
        .then((res) => {
          this.$router.push('/')
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.sheet {
  page-break-after: always;
}

/* hide in print */
@media print {
  .sheets > :not(.sheet) {
    display: none;
  }
  .sheet {
    display: block;
    padding-top: 50mm;
    // font-family: 'Klee One', cursive;
    font-size: 20px;
  }
}

/* for preview */
@media screen {
  /* mm単位で指定しているけど、vueコンポ側はpx単位なので、無理にmmにしなくてもいいかも。解像度の違いでハマるかも */
  .sheet {
    display: none;
  }
}
</style>
<style lang="scss">
/* for preview */
@media screen {
  BODY {
    background: #eee;
  }
}
</style>
