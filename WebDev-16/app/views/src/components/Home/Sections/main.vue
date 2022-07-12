<template>
  <div class="product-list-wrap">
    <section class="home">
      <h1>Sold out soon</h1>
      <div class="product-list">
        <p v-if="loading">Loading....</p>
        <el-row :gutter="5" v-else>
          <el-col :span="4" v-for="product in soldOutSoonProducts" :key="product._id">
            <div class="box" @click="toDetail(product)">
              <img :src="require(`../../../assets/phone_default_images/${product.brand}.jpeg`)" :alt="`image of ${product.brand}`">
              <p class="product-title">{{product.brand}}</p>
              <p class="product_price">$ {{product.price}}</p>
            </div>
          </el-col>
        </el-row>
        <h1>Best sellers</h1>
        <p v-if="loading">Loading....</p>
        <el-row :gutter="5" v-else>
          <el-col :span="4" v-for="product in bestSellersPhone" :key="product._id">
            <div class="box" @click="toDetail(product)">
              <img :src="require(`../../../assets/phone_default_images/${product.brand}.jpeg`)" :alt="`image of ${product.brand}`">
              <p class="product-title">{{product.title}}</p>
              <p class="product_price">$ {{product.price}}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // get sold out soon Phones
      soldOutSoonProducts: [],
      // get best sellers
      bestSellersPhone: [],
      loading: true
    }
  },

  created(){
    this.products = this.getPhoneList()
  },

  methods: {
    async getPhoneList(){
      let {data: res} = await this.$http("/phonelist")
      let totalPhoneList = res.data
      totalPhoneList.sort((a, b) => a.stock - b.stock)
      for(let i = 0; i < totalPhoneList.length; i++){
        if(totalPhoneList[i].stock > 0 && this.soldOutSoonProducts.length < 5){
          this.soldOutSoonProducts.push(totalPhoneList[i])
        }
      }
      let haveReviewsList = []
      for(let i = 0; i < totalPhoneList.length; i++){
        if(totalPhoneList[i].reviews&&totalPhoneList[i].reviews.length > 1 && totalPhoneList[i].stock > 0){
          haveReviewsList.push(totalPhoneList[i])
        }
      }
      for(let i = 0; i < haveReviewsList.length; i++){
        let reviews = haveReviewsList[i].reviews
        let totalMarks = 0
        let reviewerNumber = 0
        for(let i = 0; i < reviews.length; i++){
          totalMarks += reviews[i]['rating']
          reviewerNumber++
        }
        haveReviewsList[i]['averageRating'] = totalMarks / reviewerNumber
      }
      haveReviewsList.sort((a, b) => b.averageRating - a.averageRating)
      for(let i = 0; i < 5; i++){
        this.bestSellersPhone.push(haveReviewsList[i])
      }
      this.loading = false
    },

    toDetail(product){
      this.$store.commit("setSelectedPhone", product)
      this.$router.push("/item")
    }
  }
}
</script>

<style scoped>
.home{
  position: relative;
  top: 66px;
}

.el-row {
  margin-bottom: 20px;
}

.el-row:last-child {
  margin-bottom: 0;
}

.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}

.box{
  width: 200px;
  cursor: pointer;
}

img{
  width: 200px;
  height: 200px;
  float: left;
}

.product_price{
  font-size: 20px;
}
</style>  
