<template>
  <nav>
    <router-link to="/home" exact>
      <div class="logo">
        <span>Sell Phone</span>
        <logo> SellPhone</logo>
      </div>
    </router-link>
    <!-- main page -->
    <router-link to="/home">Home</router-link>
    <!-- search page -->
    <el-input
        type="text"
        @keydown.enter="saveInputItem"
        v-model="searchContent.title"
        placeholder="Search content"
    />
    <el-select v-model="searchContent.brand" placeholder="Brand">
      <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      >
      </el-option>
    </el-select>
    <span style="font-size:14px;font-weight: 600;">    Price Range:</span>
    <el-slider
        class="slider"
        v-model="value"
        range
        :marks="marks"
        :min="0"
        :max="1000"
    ></el-slider>
    <i class="el-icon-search" @click="saveInputItem"></i>
    <div class="nav-link">
      <router-link to="/checkout" exact>
        <div class="cart-link">
          <div v-if="noItems > 0" class="cart-link__count">{{ noItems }}</div>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              aria-labelledby="shopicon"
              role="presentation"
              width="30"
              height="30"
          >
            <title id="cart">Shopping Cart</title>
            <path
                fill="black"
                d="M8.01 10c-1.104 0-2 .896-2 2 0 1.105.896 2 2 2h10.376l10.53 49.813c-.107 1.14.952 2.245 2.095 2.187h50c1.057.015 2.03-.943 2.03-2s-.973-2.015-2.03-2H32.637l-1.688-8H85.01c.896-.01 1.742-.69 1.938-1.562l7-30c.26-1.16-.748-2.43-1.937-2.438H23.76l-1.78-8.437c-.2-.884-1.063-1.57-1.97-1.563zm16.594 14H89.51l-6.093 26H30.104zM42.01 72c-4.946 0-9 4.053-9 9s4.054 9 9 9c4.948 0 9-4.053 9-9s-4.052-9-9-9zm28 0c-4.946 0-9 4.053-9 9s4.054 9 9 9c4.948 0 9-4.053 9-9s-4.052-9-9-9zm-28 4c2.786 0 5 2.215 5 5s-2.214 5-5 5c-2.784 0-5-2.215-5-5s2.216-5 5-5zm28 0c2.786 0 5 2.215 5 5s-2.214 5-5 5c-2.784 0-5-2.215-5-5s2.216-5 5-5z"
            />
          </svg>
        </div>
      </router-link>
      <router-link to="/user" exact>
        <i class="el-icon-user"></i>
      </router-link>
    </div>
  </nav>
</template>

<script>
import logo from "../assets/logo";

export default {
  name: "TopNavigation",
  components: {
    logo,
  },
  data() {
    return {
      searchContent: {
        title: "",
        brand: "",
        lowPrice:"",
        highPrice:""
      },
      options: [
        {
          value: "Samsung",
          label: "Samsung",
        },
        {
          value: "Apple",
          label: "Apple",
        },
        {
          value: "HTC",
          label: "HTC",
        },
        {
          value: "Huawei",
          label: "Huawei",
        },
        {
          value: "LG",
          label: "LG",
        },
        {
          value: "Motorola",
          label: "Motorola",
        },
        {
          value: "Nokia",
          label: "Nokia",
        },
        {
          value: "Sony",
          label: "Sony",
        },
      ],
      value:[100,800],
      marks: {
        50:'50',
        200:'200',
        400: '400',
        600: '600',
        800: '800',
      }
    };
  },

  computed: {
    noItems() {
      return this.$store.state.cartItems;
    },
  },

  async created() {
    await this.initOptions();
  },

  methods: {
    saveInputItem() {
      // if (this.searchContent.title) {
      this.searchContent.lowPrice = this.value[0]
      this.searchContent.highPrice = this.value[1]
      this.$store.commit("InputSearch", this.searchContent);
      this.$router.push({
        path: "/search",
        query: { id: Math.random() },
      });
      // } else {
      //   this.$message.error("Please enter the phone title !");
      // }
    },
    async initOptions() {
      const { data } = await this.$http.get("/phonelist/distinct");
      if (data.code === 200) {
        this.options = [];
        for (const i of data.data) {
          this.options.push({
            value: i,
            label: i,
          });
        }
      }
    },
  },
};
</script>

<style lang="css" scoped>
nav {
  box-shadow: 1px 0rem 14px 0px #eee;
  width: 100%;
  padding: 24px;
  position: fixed;
  top: 0px;
  height: 66px;
  background-color: #fff;
  z-index: 99;
}

nav > a {
  font-size: 16px;
  color: #131313;
  font-weight: bold;
  text-decoration: none;
  margin-right: 50px;
  letter-spacing: 0.5px;
}

nav a:hover {
  opacity: 0.7;
}

nav a.router-link-active {
  color: #5044ff;
}

.logo {
  float: left;
  position: relative;
  top: -7px;
}

.logo span {
  line-height: 66px;
  font-size: 3em;
  position: relative;
  top: -10px;
  margin-right: 20px;
}

.logo svg {
  width: 40px;
  height: 40px;
}

@media (max-width: 600px) {
  nav {
    padding: 20px;
  }

  nav > a {
    margin-right: 20px;
  }
}

.nav-link {
  display: inline;
}

.cart-link {
  float: right;
  position: relative;
}

.cart-link__count {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  top: -5px;
  right: -5px;
  background: #5044ff;
  color: #fff;
  font-size: 14px;
  font-weight: bold;
}

.el-icon-user {
  position: absolute;
  right: 100px;
  font-size: 30px;
}

.el-icon-search {
  margin-left: 5px;
  margin-right: 30px;
  font-size: 20px;
  cursor: pointer;
  position: relative;
  top: 3px;
}

.slider{
  display: inline-block;
  width: 300px;
  height: 25px;
  margin: 0px 20px;
}

.el-input {
  width: 180px;
  margin-right: 10px;
}
.el-input__inner {
  height: 30px;
  border: 1px solid black;
}
.el-input__icon {
  line-height: 30px;
}
.el-input__inner:focus {
  border-color: #c0c4cc !important;
}
</style>
