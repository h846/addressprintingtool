<template>
  <v-app>
    <v-app-bar id="appbar" dense max-height="48px">
      <v-toolbar-title>
        <nuxt-link to="/" tag="div" style="cursor: pointer"
          >CS-Net Label Print</nuxt-link
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="print-history">印刷履歴</v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
}
</script>
<style>
@media print {
  #appbar {
    display: none;
  }
}
</style>
