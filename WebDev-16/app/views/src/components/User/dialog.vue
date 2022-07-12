<template>
  <div>
    <el-dialog
        title="new product info"
        :visible="dialogVisible"
        width="30%"
        @close="$emit('close')"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item prop='title' label="Title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item prop='brand' label="Brand">
          <el-input v-model="form.brand"></el-input>
        </el-form-item>
        <el-form-item prop='price' label="Price">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item prop='stock' label="Storage">
          <el-input v-model="form.stock"></el-input>
        </el-form-item>
        <el-form-item prop='image' label="Image address">
          <el-input v-model="form.image"></el-input>
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button type="info" @click="$emit('close')"> Cancel </el-button>
        <el-button type="primary" @click="submit"> Confirm </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["close"],
  data() {
    return {
      form:{
        title:'',
        brand:'',
        price:'',
        stock:'',
        image:''
      },
      rules:{
        title:[{ required: true, message: "title", trigger: "blur" }],
        brand:[{ required: true, message: "brand", trigger: "blur" }],
        price:[{ required: true, message: "price", trigger: "blur" }],
        stock:[{ required: true, message: "storage", trigger: "blur" }],
      }
    };
  },
  methods: {
    submit() {
      this.$refs.form.validate(async (valid)=>{
        if(valid){
          const { data } = await this.$http.post('/phonelist/add',this.form)
          if(data.code === 200){
            this.$emit('close','success')
            this.$message.success(data.message)
          }else{
            this.$message.warning(data.message)
          }
        }
      })
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-dialog__header{
  text-align: center ;
  font-size: 24px;
}
/deep/ .el-dialog__footer {
  text-align: center !important;
  .el-button {
    margin: 0 5%;
  }
}
</style>