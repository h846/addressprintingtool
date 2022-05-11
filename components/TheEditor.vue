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
                label="顧客番号"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="姓" hide-details required></v-text-field>
            </v-col>
            <v-col cols="4">
              <v-text-field label="名" hide-details required></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="2">
              <v-text-field
                label="郵便番号"
                hide-details
                required
              ></v-text-field>
            </v-col>
            <v-col cols="10">
              <v-text-field label="住所1" hide-details required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="住所2" hide-details></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field label="住所3" hide-details></v-text-field>
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
  data() {
    return {
      dialog: false,
    }
  },
}
</script>

<style></style>
