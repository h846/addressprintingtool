export const state = () => ({
  isLoading: false,
})

export const mutations = {
  toggleLoading(state, boolean) {
    state.isLoading = boolean
  },
}
