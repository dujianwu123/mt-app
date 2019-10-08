<template>
  <div class="m-iselect">
    <span class="name">按省份选择:</span>
    <el-select 
      v-model="pvalue" 
      placeholder="省份">
      <el-option 
        v-for="item in province" 
        :key="item.value" 
        :label="item.label" 
        :value="item.value"/>
    </el-select>
    <el-select 
      v-model="cvalue"
      :disabled="!city.length"
      placeholder="城市"
      @change="city_change">
      <el-option 
        v-for="item in city"
        :key="item.value" 
        :label="item.label" 
        :value="item.label"/>
    </el-select>
    <el-autocomplete
      v-model="input"
      :fetch-suggestions="querySearchAsync"
      placeholder="请输入城市中文或拼音"
      :trigger-on-focus="false"
      @select="handleSelect"
    />
  </div>
</template>

<script>
import _ from 'lodash';
import pyjs from 'js-pinyin';
import Cookies from 'js-cookie';
export default {
  data() {
    return {
      pvalue: "",
      province: [],
      city:[],
      cvalue:'',
      input:'',
      cities:[],
    };
  },
  watch:{
    // 当省份的被选择有变化的时候，去联动获取市的数据存储在this.city中
    pvalue:async function(newPvalue){
      let self=this;
      let {status,data:{city}}=await self.$axios.get(`/geo/province/${newPvalue}`)
      if(status===200){
        self.city=city.map(item=>{
          return {
            value:item.id,
            label:item.name
          }
        })
        self.cvalue=''
      }
    }
  },
  mounted : async function() {
    let self=this;
    let {status,data:{province}}=await self.$axios.get('/geo/province')
    if(status===200){
      self.province=province.map(item=>{
        return {
          value:item.id,
          label:item.name
        }
      })
    }
  },
  methods: {
    querySearchAsync:_.debounce(async function(query,cb){
      let self=this;
      if(self.cities.length){
        // 搜索一个北字就把所有带北字的地名都返回
        // cb(self.cities.filter(item => item.value.indexOf(query)>-1));

        if (/^[a-zA-Z]+$/g.test(query)) { // 拼音
          let cities ;
          cities=self.cities.filter(item => {
            return item.pinyin.indexOf(query)>-1
          })
          cb(cities)
        } else if (/^[\u4e00-\u9fa5]+$/g.test(query)) {  // 汉字
          cb(self.cities.filter(item => item.value.indexOf(query)>-1));
        } else{
          cb([self.cities])
        }
      }else{
        let {status,data:{city}}=await self.$axios.get('/geo/city')
        if(status===200){
          // 因为数据里有省的数据，所以过滤下只要市的数据
          city=city.filter((item)=>{
            return item.name.substr(item.name.length-1,item.name.length) === '市'
          })
          // 要注意用element-ui 的动态加载框的数据的规则，就是必须是[{value}] 数组>对象>必须有value值
          self.cities=city.map(item=>{return {
            value:item.name,
            pinyin: pyjs.getFullChars(item.name.substr(0,item.name.length-1)).toLocaleLowerCase()
          }})
          cb(self.cities.filter(item => item.value.indexOf(query)>-1))
        }else{
          cb([])
        }
      }
    },200),
    handleSelect:function(item){
      this.to(item.value);
    },
    to: function (value) {
      Cookies.set('cityName', value,{ expires: 1 });
      this.$store.commit('geo/setPosition',{province:'',city:value});
      window.location.href='/';
    },
    city_change(value){
      this.to(value);
    }
  }
};
</script>

<style lang="scss" scope>
  @import "@/assets/css/changeCity/iselect.scss";
</style>