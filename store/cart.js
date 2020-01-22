export const state = () => ({
    store: {
        quantity: 0
    }
  })
  
  export const mutations = {
    add (state, text) {
        state.store.quantity = text;
    },

  }