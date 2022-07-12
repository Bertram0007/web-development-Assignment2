import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user:  JSON.parse(window.sessionStorage.getItem('user')||'null'),
    selectPhoneItem: {},
    cart: [],
    searchResult: {}
  },
  mutations: {
    SET_USER(state, payload) {
      state.user = payload
      window.sessionStorage.setItem('user',JSON.stringify(payload))
    },
    setSelectedPhone(state, payload){
      state.selectPhoneItem = payload
    },
    addToCart(state, payload){
      for(let i = 0; i < state.cart.length; i++){
        if(state.cart[i].id == payload.id){
          state.cart[i].quantity += payload.quantity
          return
        }
      }
      state.cart.push(payload)
    },
    deleteItem(state, payload){
      state.cart = state.cart.filter(item => {
        return item.id !== payload.id
      })
    },
    clearCart(state, payload){
      state.cart = []
    },
    InputSearch(state, payload){
      state.searchResult = payload
    }
  },
  actions: {
  },
  modules: {
  }
})