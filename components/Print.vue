<template>
  <div class="sheets">
    <div v-for="(item, index) in custList" :key="index" class="sheet">
      <div>{{ item.POSTCODE }}</div>
      <div>{{ item.Add1 + item.Add2 + item.Add3 }}</div>
      <div>{{ item.CUST_NAME }} 様</div>
    </div>
    <div class="mb-5" style="text-align: center">
      <v-btn
        color="red darken-2"
        dark
        x-large
        width="700"
        @click="handlePrint()"
        >印刷する</v-btn
      >
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
export default {
  props: {
    custList: {
      type: Array,
      default() {
        return []
      },
    },
  },

  methods: {
    handlePrint() {
      // Disp print page
      window.print()
    },
    printCompleated() {},
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
    padding-top: 10mm;
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
