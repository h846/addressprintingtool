<template>
  <div class="sheets">
    <div v-for="(item, index) in custList" :key="index" class="sheet">
      <div class="post-code">
        〒<span>{{ item.CM_ZIP }}</span>
      </div>
      <div class="vertical">
        <div class="address1">
          <span>{{
            hankana2Zenkana(item.CM_BILL_ADDRESS1 + item.CM_BILL_ADDRESS2)
          }}</span>
        </div>
        <!--
        <div class="address2"><span>横浜市港北区新横浜ﾒｿﾞﾝ</span></div>
        <div class="address3">横浜市港北区新横浜1-19-20</div>
-->
        <div v-if="item.CM_BILL_ADDRESS3 !== 'null'" class="address2">
          <span>{{ hankana2Zenkana(item.CM_BILL_ADDRESS3) }}</span>
        </div>
        <div v-if="item.CM_BILL_ADDRESS4 !== 'null'" class="address3">
          {{ hankana2Zenkana(item.CM_BILL_ADDRESS4) }}
        </div>
        <div class="cust-name">
          {{ item.CM_BILL_LAST }}
          <span v-if="item.CM_BILL_FIRST !== 'null'">{{
            item.CM_BILL_FIRST
          }}</span>
          様
        </div>
      </div>
      <div class="cust-num">
        {{ item.CM_CUSTOMER_ID }}
      </div>
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
      <v-btn color="red darken-2" dark text @click="goHome()"
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
    // window.print()
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

    hankana2Zenkana(str) {
      const kanaMap = {
        ｶﾞ: 'ガ',
        ｷﾞ: 'ギ',
        ｸﾞ: 'グ',
        ｹﾞ: 'ゲ',
        ｺﾞ: 'ゴ',
        ｻﾞ: 'ザ',
        ｼﾞ: 'ジ',
        ｽﾞ: 'ズ',
        ｾﾞ: 'ゼ',
        ｿﾞ: 'ゾ',
        ﾀﾞ: 'ダ',
        ﾁﾞ: 'ヂ',
        ﾂﾞ: 'ヅ',
        ﾃﾞ: 'デ',
        ﾄﾞ: 'ド',
        ﾊﾞ: 'バ',
        ﾋﾞ: 'ビ',
        ﾌﾞ: 'ブ',
        ﾍﾞ: 'ベ',
        ﾎﾞ: 'ボ',
        ﾊﾟ: 'パ',
        ﾋﾟ: 'ピ',
        ﾌﾟ: 'プ',
        ﾍﾟ: 'ペ',
        ﾎﾟ: 'ポ',
        ｳﾞ: 'ヴ',
        ﾜﾞ: 'ヷ',
        ｦﾞ: 'ヺ',
        ｱ: 'ア',
        ｲ: 'イ',
        ｳ: 'ウ',
        ｴ: 'エ',
        ｵ: 'オ',
        ｶ: 'カ',
        ｷ: 'キ',
        ｸ: 'ク',
        ｹ: 'ケ',
        ｺ: 'コ',
        ｻ: 'サ',
        ｼ: 'シ',
        ｽ: 'ス',
        ｾ: 'セ',
        ｿ: 'ソ',
        ﾀ: 'タ',
        ﾁ: 'チ',
        ﾂ: 'ツ',
        ﾃ: 'テ',
        ﾄ: 'ト',
        ﾅ: 'ナ',
        ﾆ: 'ニ',
        ﾇ: 'ヌ',
        ﾈ: 'ネ',
        ﾉ: 'ノ',
        ﾊ: 'ハ',
        ﾋ: 'ヒ',
        ﾌ: 'フ',
        ﾍ: 'ヘ',
        ﾎ: 'ホ',
        ﾏ: 'マ',
        ﾐ: 'ミ',
        ﾑ: 'ム',
        ﾒ: 'メ',
        ﾓ: 'モ',
        ﾔ: 'ヤ',
        ﾕ: 'ユ',
        ﾖ: 'ヨ',
        ﾗ: 'ラ',
        ﾘ: 'リ',
        ﾙ: 'ル',
        ﾚ: 'レ',
        ﾛ: 'ロ',
        ﾜ: 'ワ',
        ｦ: 'ヲ',
        ﾝ: 'ン',
        ｧ: 'ァ',
        ｨ: 'ィ',
        ｩ: 'ゥ',
        ｪ: 'ェ',
        ｫ: 'ォ',
        ｯ: 'ッ',
        ｬ: 'ャ',
        ｭ: 'ュ',
        ｮ: 'ョ',
        '｡': '。',
        '､': '、',
        ｰ: 'ー',
        '｢': '「',
        '｣': '」',
        '･': '・',
      }

      const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g')
      return str
        .replace(reg, function (match) {
          return kanaMap[match]
        })
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜')
        .replace(/-/g, '|')
    },
  },
}
</script>

<style lang="scss" scoped>
.sheet {
  position: relative;
  page-break-after: always;
  width: 240mm;
  height: 332mm;
  font-family: '游明朝', YuMincho, 'ヒラギノ明朝 ProN W3',
    'Hiragino Mincho ProN', 'ＭＳ Ｐ明朝', 'ＭＳ 明朝', serif;
}

.vertical {
  -ms-writing-mode: tb-rl;
  -webkit-writing-mode: vertical-rl;
  writing-mode: vertical-rl;
  line-height: 5rem;
  //letter-spacing: 3rem;
  text-indent: 1em;
  span {
    text-orientation: upright;
  }
}

.post-code {
  position: absolute;
  letter-spacing: 1px;
  font-size: 38px;
  top: 10px;
  right: 60px;
}
.address1 {
  position: absolute;
  letter-spacing: 1px;
  font-size: 48px;
  top: 75px;
  right: 60px;
}
.address2 {
  @extend .address1;
  right: 120px;
}
.address3 {
  @extend .address1;
  right: 180px;
}

.cust-name {
  position: absolute;
  letter-spacing: 1px;
  top: 150px;
  right: 480px;
  font-size: 72px;
}

.cust-num {
  position: absolute;
  letter-spacing: 1px;
  bottom: 10px;
  left: 10px;
  font-size: 24px;
}

@media print {
  .sheets > :not(.sheet) {
    display: none;
  }
  .sheets > * {
    margin: 0;
    padding: 0;
  }
}
/* for preview */
@media screen {
  .sheet {
    //display: none;
  }
}
</style>
