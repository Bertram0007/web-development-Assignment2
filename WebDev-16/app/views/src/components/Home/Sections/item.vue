<template>
  <div>
    <div class="box">
      <img :src="require(`../../../assets/phone_default_images/${selectPhoneItem.brand}.jpeg`)" alt="selectPhoneItem">
      <p class="product-title">{{selectPhoneItem.title}}</p>
      <p class="product-brand">Brand: {{selectPhoneItem.brand}}</p>
      <p class="product-seller" v-if="selectPhoneItem.seller.length">Sellers: {{selectPhoneItem.seller}}</p>
      <p class="product-seller" v-else>Seller: Unknown</p>  
      <p class="product_price">Price: $ {{selectPhoneItem.price}}</p>
      <p class="product_stock">In-Stock: {{selectPhoneItem.stock}}</p>
      <el-button type="danger" class="addToCart" plain :disabled="selectPhoneItem.stock <= 0 ? true : false" @click="dialogVisible=true">Add to Cart</el-button>
    </div>
    <div class="myReviews">
      <el-input
        type="textarea"
        :rows="3"
        :minlength="6"
        placeholder="Publish your review here !"
        v-model="textarea"
        class="commentInput"
        >
      </el-input>
      <div class="mystar">
        <el-rate v-model="myRating"></el-rate>
      </div>
      <el-button type="primary" class="addComment" @click="addComment">Publish Review</el-button>
    </div>
    <h2> Reviews </h2>
    <div class="reviews" v-if="hasReviews">
      <template  v-for="review in reviews">
        <div :key="review.reviewer" class="singleReview">
            <p>
              Name: <span class="reviewer_name">{{review.name}}</span>
              <span>Rating: </span>
              <img ref="star" src="../../../assets/images/outline-star-16.jpg" alt="star">
              <img ref="star" src="../../../assets/images/outline-star-16.jpg" alt="star">
              <img ref="star" src="../../../assets/images/outline-star-16.jpg" alt="star">
              <img ref="star" src="../../../assets/images/outline-star-16.jpg" alt="star">
              <img ref="star" src="../../../assets/images/outline-star-16.jpg" alt="star">
            </p>
            <p class="reviewer_comment" v-if="review.comment.length > 200 && !review.showAll">{{review.comment.slice(0, 201) + "..."}}
              <el-button type="info" size="mini" @click="handleShowRestWords(review)">show more</el-button>
            </p>
            <p class="reviewer_comment" v-else>{{review.comment}}</p>
            <hr>
        </div>
      </template>
      <el-button type="primary" class="showMoreButton" plain v-if="showButton" @click="handleShowMoreReviews">Show More Reviews</el-button>
    </div>
    <div v-else class="noComment">
      <p>No comment</p>
    </div>
    <el-dialog
        title="Add to cart"
        :visible.sync="dialogVisible"
        width="30%"
    >
      <p>
        <span>Please enter the number of {{selectPhoneItem.title}} that you need</span>
      </p>
      <el-input-number v-model="num" :min="1" :max="selectPhoneItem.stock" label="Description"></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible=false">Cancel</el-button>
        <el-button type="primary" @click="handleNumberChange">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      reviews: [],
      reviewRatings: [],
      hasReviews: true,
      dialogVisible: false,
      num: 0,
      showButton: true,
      textarea: '',
      myRating: 0,
      count: 0,
    }
  },

  computed:{
    ...mapState(["selectPhoneItem","user"])
  },

   created() {
    this.getReviews()
    this.getUserName()
  },

  mounted(){
    this.calcuStars()
  },

  methods: {
    getReviews(){
      console.log( this.selectPhoneItem);
      for(let i = 0; i < this.selectPhoneItem.reviews.length; i++){
        this.reviewRatings.push(this.selectPhoneItem.reviews[i].rating)
      }
      if(this.selectPhoneItem.reviews.length != 0){
        for(let i = 0; i < 3; i++){
          this.reviews = this.selectPhoneItem.reviews.slice(0, 3)
        }
      }else{
        this.hasReviews = false
      }
      if(this.selectPhoneItem.reviews.slice(this.reviews.length, this.reviews.length + 3).length == 0){
        this.showButton = false
      }
    },

    async getUserName(){
      for(let i = 0; i < this.selectPhoneItem.reviews.length; i++){
        let NameObj = {
          id: this.selectPhoneItem.reviews[i].reviewer
        }
        let {data:res} = await this.$http.post('/getName', NameObj)
        this.$set(this.selectPhoneItem.reviews[i], 'name', res.data)
      }
    },

    handleNumberChange(){
      let originalRemain = this.selectPhoneItem.stock
      this.selectPhoneItem.stock -= this.num
      let phoneObj = {
        id: this.selectPhoneItem._id,
        title: this.selectPhoneItem.title,
        singlePrice: this.selectPhoneItem.price,
        stock: this.selectPhoneItem.stock,
        quantity: this.num,
        originalRemain
      }
      this.$store.commit("addToCart", phoneObj)
      this.dialogVisible=false
    },

    handleShowRestWords(review){
      this.$set(review, 'showAll', true)
    },

    handleShowMoreReviews(){
      this.reviews = this.reviews.concat(this.selectPhoneItem.reviews.slice(this.reviews.length, this.reviews.length + 3))
      if(this.selectPhoneItem.reviews.slice(this.reviews.length, this.reviews.length + 3).length == 0){
        this.showButton = false
      }
      this.calcuStars()
    },

    addComment(){
      if(!this.user){
        this.$router.push('/login')
        return
      }
      if(this.textarea.length < 6){
        this.$message.error("Please enter at least 6 characters !")
      }else if(this.myRating === 0){
        this.$message.error("Please give a rating !")
      }else{
        let myReviewObj = {
          reviewer: this.user._id,
          id: this.selectPhoneItem._id,
          comment: this.textarea,
          rating: this.myRating
        }
        this.$http.post("/makeReview", myReviewObj)
        this.selectPhoneItem.reviews = this.selectPhoneItem.reviews.concat(myReviewObj)
        this.reviewRatings.push(myReviewObj.rating)
        this.showButton = true
        this.calcuStars()
        this.$message.success('Comment successful !')
        this.textarea = ""
      }
    },    

    calcuStars(){
      this.$nextTick(() => {
        while(this.$refs.star.length){
          let stars = this.$refs.star.splice(0, 5)
          for(let j = 0; j < this.reviewRatings[this.count]; j++){
            stars[j].src = require(`../../../assets/images/star-16.jpg`)
          }
          this.count++
        }
      })
    },

    addToCart(){
      if(this.user){
        this.dialogVisible=true
      }else{
        this.$router.push({name:'login',query:{ redirect: '/item' }})
      }
    }
  },
}
</script>

<style scoped>
 .box{
    width: 800px;
    height: 400px;
    margin: 166px auto 0 auto;
  }

  .box img{
    width: 400px;
    height: 400px;
    float: left;
    margin-right: 10px;
  }

  .box p{
    font-size: 25px;
    position: relative;
    text-align: left;
    margin: 10px;
    top: 50px;
  }

  .addToCart{
    position: relative;
    top: 40px;
  }

  .product-title{
    font-weight: bolder;
  }

  .myReviews{
    width: 800px;
    margin: 40px auto;
  }

  .addComment{
    position: relative;
    left: 275px;
    top: 10px;
  }

  h2{
    width: 50px;
    position: relative;
    left: 350px;
  }

  .reviews{
    width: 800px;
    min-height: 50px;
    margin: 10px auto;
    border: 1px solid black;
    border-left: transparent;
    border-right: transparent;
  }

  .singleReview{
     margin: 20px auto;
  }

  .reviewer_name{
    font-weight: bold;
  }

  p{
    text-align: left;
    text-indent: 10px;
    margin-right: 5px;
  }

  p span{
    margin-right: 10px;
  }

  .noComment{
    width: 800px;
    height: 50px;
    margin: 30px auto 0 auto;
  }

  .noComment p{
    font-size: 25px;
  }

  hr{
    margin-top: 15px;
  }

  .mystar{
    min-width: 20px;
    float: left;
    position: relative;
    top: 10px;
    cursor: pointer;
  }
</style>
