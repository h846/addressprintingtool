<template>
  <div class="sheets">
    <div v-for="(item, index) in custList" :key="index" class="sheet">
      <div>{{ item.POSTCODE }}</div>
      <div>{{ item.Add1 + item.Add2 + item.Add3 }}</div>
      <div>{{ item.CUST_NAME }} 様</div>
    </div>
    <v-btn @click="handlePrint()">印刷</v-btn>
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
      window.print()
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
    padding-top: 10mm;
  }
}

/* for preview */
@media screen {
  /* mm単位で指定しているけど、vueコンポ側はpx単位なので、無理にmmにしなくてもいいかも。解像度の違いでハマるかも */
  .sheet {
    width: 200mm;
    //min-height: 296mm; /* 設定しなくてもいいかも。あまり印刷画面に似せすぎると、些細な違いがバグに見えてしまう */
    margin: 5mm;
    padding: 5mm;
    background: white;
    box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
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
