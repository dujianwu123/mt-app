<template>
  <div class="m-hcity">
    <dl>
      <dt>热门城市：</dt>
      <dd
        v-for="item in list"
        :key="item.id"
        :style="styleObject"
        @click="toLink">
        {{ item.name==='市辖区'?item.province:item.name }}
      </dd>
    </dl>
  </div>
</template>

<script>
import Cookies from 'js-cookie';
export default {
  data(){
    return {
      list:[],
      styleObject:{
        cursor:'pointer'
     }
    }
  },
  async mounted(){
    let {status,data:{hots}}=await this.$axios.get('/geo/hotCity')
    if(status===200){
      this.list=hots
    }
  },
  methods: {
    toLink (e) {
      this.to(e.target.innerText)
    },
    to: function (value) {
      Cookies.set('cityName', value,{ expires: 1 });
      this.$store.commit('geo/setPosition',{province:'',city:value});
      window.location.href='/';
    }
  }
}
</script>

<style lang="scss">
  @import "@/assets/css/changeCity/hot.scss";
</style>
