<template>
  <div class="search">
    <p class="noResult" v-if="!PhoneList.length">No search result</p>
    <div class="search-container">
      <div
          class="search-container-box"
          v-for="phone in PhoneList"
          :key="phone._id"
          @click="toDetail(phone)"
      >
        <img
            :src="
            require(`../../../assets/phone_default_images/${phone.brand}.jpeg`)
          "
            :alt="`image of ${phone.brand}`"
        />
        <p class="product-title">{{ phone.brand }}</p>
        <p class="product_price">$ {{ phone.price }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "search",
  data() {
    return {
      PhoneList: [],
    };
  },

  computed: {
    ...mapState(["searchResult"]),
  },

  created() {
    this.getPhoneList();
  },

  methods: {
    async getPhoneList() {
      let { data: res } = await this.$http("/phonelist", {
        params: this.searchResult,
      });
      this.PhoneList = res.data;
      console.log(this.searchResult);
    },
    toDetail(phone) {
      this.$store.commit("setSelectedPhone", phone);
      this.$router.push("/item");
    },
  },

  watch:{
    '$route.query':{
      async handler(newval, oldval){
        await this.getPhoneList()
      },
      deep:true,
    }
  }
};
</script>

<style scoped>
.noResult {
  margin: 166px auto;
}
.search {
  padding-top: 88px;
  box-sizing: border-box;
}
.search-container {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.search-container-box {
  width: 19%;
  height: 45%;
  margin-right: 1%;
  cursor: pointer;
}
.search-container-box img {
  width: 100%;
  height: 100%;
}
.product_price {
  font-size: 20px;
}
</style>
