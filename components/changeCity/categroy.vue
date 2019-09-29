<template>
  <div>
    <dl class="m-categroy">
      <dt>按拼音首字母选择：</dt>
      <dd
        v-for="item in list"
        :key="item">
        <a :href="'#city-'+item">{{ item }}</a>
      </dd>
    </dl>
    <dl
      v-for="item in block"
      :key="item.title"
      @click="toCityLink"
      class="m-categroy-section">
      <dt :id="'city-'+item.title">{{ item.title }}</dt>
      <dd>
        <span
          :style="styleObject"
          v-for="c in item.city"
          :key="c">{{ c }}</span>
      </dd>
    </dl>
  </div>
</template>

<script>
import pyjs from 'js-pinyin'
import Cookies from 'js-cookie';
export default {
  data () {
    return {
      list: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''),
      block: [],
      styleObject:{
        cursor:'pointer'
      }
    }
  },
  async mounted () {
    let blocks = [];
    let {status, data:{city}} = await this.$axios.get('/geo/city');
    if (status === 200) {
      let p; // 首字母 小写
      let c; // 首字母的chaiCodeAt(0)的值
      let d = {}; // 暂存合集 {'a':['啊xx','拼音以a开头的'],...}
      city.forEach(item => {
        p=pyjs.getFullChars(item.name).toLocaleLowerCase().slice(0,1)
        c=p.charCodeAt(0);
        if (c>96 && c<123) { // 意思就是a-z,a.charCodeAt(0)=97,z.charCodeAt(0)=122
          if (!d[p]) {
            d[p] = []
          }
          d[p].push(item.name)
        }
      });

      // 将 d的值转化为想要的数组格式
      // [{title:A,city:['啊','啊啊']},...]
      for (let [k, v] of Object.entries(d)) {
        blocks.push({
          title: k.toUpperCase(),
          city: v
        })
      }

      // 将blocks 安a-z排序 ,在赋值给this.block
      blocks.sort((a,b)=>a.title.charCodeAt(0)-b.title.charCodeAt(0))
      this.block=blocks
    }
  },
  methods: {
    toCityLink (e){
      let oDom = e.target;
      if (oDom.tagName==='SPAN') {
        this.to(oDom.innerText);
      }
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
  @import "@/assets/css/changeCity/categroy.scss";
</style>