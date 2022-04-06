<template>
  <div class="sheets">
    <div v-for="(item, index) in custList" :key="index" class="sheet">
      <div>〒{{ item.POSTCODE }}</div>
      <div>{{ item.Add1 + item.Add2 + item.Add3 }}</div>
      <div>{{ item.CUST_NAME }} 様</div>
      <div>{{ item.CUST_NUM }}</div>
    </div>

    <div class="mb-5" style="text-align: center">
      <v-btn
        color="red darken-2"
        dark
        x-large
        width="700"
        @click="printCompleated()"
        >印刷済みにする</v-btn
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
          this.$emit('printed')
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
    padding-top: 5mm;
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
