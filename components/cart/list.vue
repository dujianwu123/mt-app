<template>
  <el-table
    :data="cartData"
    style="width: 980px">
    <el-table-column
      prop="name"
      label="项目"
      width="532"/>
    <el-table-column
      prop="price"
      label="单价"
      width="132"/>
    <el-table-column
      label="数量"
      width="212">
      <template v-slot:default="slotProps">
        <el-input-number
          v-model="slotProps.row.count"
          :min="0"/>
      </template>
    </el-table-column>
    <el-table-column label="总价">
      <template v-slot:default="slotProps">
        <div class="">
          {{ slotProps.row.price*slotProps.row.count }}
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    cartData: {
      type: Array,
      default: () => {
        return []
      }
    }
  }
}
</script>
