<template>
  <v-dialog v-model="dialog" max-width="600px">
    <template #activator="{ on, attrs }">
      <v-icon class="mr-2" v-bind="attrs" v-on="on"> mdi-pencil </v-icon>
    </template>
    <v-card>
      <v-card-title>
        <span class="text-h5">宛名編集</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="4">
              <v-text-field
                v-model="custNum"
                label="顧客番号"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="lName"
                label="姓"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field
                v-model="fName"
                label="名"
                hide-details
                required
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text-field
                v-model="zipCode"
                label="郵便番号"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field
                v-model="add1"
                label="住所1"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="add2"
                label="住所2"
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="add3"
                label="住所3"
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="dialog = false"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: { custId: { type: Number, default: null } },
  data() {
    return {
      dialog: false,
      custNum: '',
      fName: '',
      lName: '',
      zipCode: '',
      add1: '',
      add2: '',
      add3: '',
    }
  },

  computed: {
    customer() {
      const list = this.$store.getters.customers.filter(
        (val) => val.ACC_ID === this.custId
      )
      return list[0]
    },
  },

  mounted() {
    console.log(this.customer)
    this.custNum = this.customer.CM_CUSTOMER_ID
    this.lName = this.customer.CM_BILL_LAST
    this.fName = this.customer.CM_BILL_FIRST
    this.zipCode = this.customer.CM_ZIP
    this.add1 = this.customer.CM_BILL_ADDRESS1
    this.add2 =
      this.customer.CM_BILL_ADDRESS2 === 'null'
        ? ''
        : this.customer.CM_BILL_ADDRESS2
    this.add3 =
      this.customer.CM_BILL_ADDRESS3 === 'null'
        ? ''
        : this.customer.CM_BILL_ADDRESS3
  },
}
</script>
