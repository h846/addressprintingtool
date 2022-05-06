<template>
  <v-app>
    <v-app-bar id="appbar" dense max-height="48px">
      <v-toolbar-title>
        <nuxt-link to="/" tag="div" style="cursor: pointer"
          >CS-Net Label Print</nuxt-link
        >
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="primary" outlined to="print-history">印刷履歴</v-btn>

      <v-progress-linear
        :active="isLoading"
        :indeterminate="isLoading"
        absolute
        bottom
        color="red darken-2"
      ></v-progress-linear>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <div style="max-width: 800px; margin: 0 auto">
          <Nuxt />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  computed: {
    isLoading() {
      return this.$store.state.isLoading
    },
  },
}
</script>
<style>
@media print {
  #appbar {
    display: none;
  }
}
</style>
