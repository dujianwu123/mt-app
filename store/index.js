import Vue from 'vue'
import Vuex from 'vuex'
import geo from './modules/geo'
import home from './modules/home'

Vue.use(Vuex);
const store = () => new Vuex.Store({
  modules: {
    geo,
    home
  },
  actions: {
    async nuxtServerInit({commit},{req,app}) {
      // 当前所在地
      const {status:statusCity,data:{province,city}}=await app.$axios.get('geo/getPosition');
      commit('geo/setPosition',statusCity === 200 ? {province, city} : {province:'',city:''});

      // 菜单列表
      const {status:statusMenu,data:{menu}}=await app.$axios.get('geo/menu');
      commit('home/setMenu',statusMenu === 200 ? menu : []);
    }
  }
})

export default store