<template>
  <div>
    <div class="head">
      <div class="head-title" v-if="!$route.query.email">{{ "Sell Phone - " + $route.path.replace("/", "")}}</div>
      <div class="head-link" v-if="!$route.query.email">
        <router-link :class="{ active: $route.path === '/user' }" to="/user"
          >User</router-link
        >
        <router-link
          :class="{ active: $route.path === '/user/edit' }"
          to="/user/edit"
          >Edit-Profile</router-link
        >
        <router-link
          :class="{ active: $route.path === '/user/phoneList' }"
          to="/user/phoneList"
        >
          Phone-List</router-link
        >
        <router-link
          :class="{ active: $route.path === '/user/comments' }"
          to="/user/comments"
          style="margin-right: 20px"
        >
          Comments</router-link
        >
        <span class="goHome" @click="$router.push('/home')"
          >Home<i class="el-icon-s-shop"></i
        ></span>
      </div>
    </div>
    <div class="banner">
      <h1 class="banner-title">Sell Phone</h1>
      <p class="banner-content">Your dream phone market place.</p>
    </div>
    <div class="footer" v-if="$route.path === '/user'">
      <h4>Change Password</h4>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item v-if="!$route.query.email" prop="oldPassword" label="Old：">
          <el-input type="password" v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item prop="newPassword" label="New：">
          <el-input type="password" v-model="form.newPassword"></el-input>
        </el-form-item>
        <div class="operation">
          <el-button class="submit" @click="onSubmit">Confirm</el-button>
          <el-button class="out" @click="out">Logout</el-button>
        </div>
      </el-form>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapState,mapMutations } from "vuex";
export default {
  data() {
    return {
      form: {
        oldPassword: "",
        newPassword: "",
      },
      rules: {
        oldPassword: [
          { required: true, message: "original pas", trigger: "blur" },
        ],
        newPassword: [{ required: true, message: "new pas", trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapMutations((['SET_USER'])),
    onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if (this.user) {
            this.form.email = this.user.email;
            this.form.lastname = this.user.lastname;
            this.form.firstname = this.user.firstname;
          }
          if(this.$route.query.email){
            this.form.email = this.$route.query.email;
          }
          const { data } = this.$route.query.email 
          ? await this.$http.post("/user/updatepsd", this.form)
          : await this.$http.post("/user/change", this.form)
          if (data.code === 200) {
            this.$message.success(data.message);
            this.$router.push("/login");
          } else {
            this.$message.warning(data.message);
          }
          console.log(data);
        }
      });
    },
    out() {
      this.$router.push("/login");
      window.sessionStorage.clear()
      this.SET_USER(null);
    },
  },
  computed: {
    ...mapState(["user"]),
  },
};
</script>

<style lang="scss" scoped>
.head {
  height: 56px;
  line-height: 56px;
  background-color: #fff;
  color: #5044ff;
  display: flex;
  justify-content: space-between;
  &-title {
    padding-left: 50px;
    font-family: sans-serif;
    color: #5044ff;
    font-size: 24px;
    font-weight: 600;
  }
  &-link {
    padding-right: 50px;
    a {
      font-size: 15px;
      color: rgba(0, 0, 0, 0.3);
      margin: 0px 10px;
      text-decoration: none;
      &:hover {
        color: #5044ff;
      }
    }
    .active {
      color: #000;
    }
  }
}
.banner {
  width: 100%;
  height: 150px;
  background: #5044ff;
  color: white;
  box-shadow: inset 0 8px 8px -8px rgba(0, 0, 0, 0.3),
    inset 0 -8px 8px -8px rgba(0, 0, 0, 0.3);
  padding-top: 10px;
  &-title {
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    font-weight: 700 !important;
    text-align: center;
    font-size: 48px;
    padding-bottom: 8px;
  }
  p {
    color: #fff;
    text-align: center;
    font-size: 24px;
    font-weight: 300 !important;
    margin-bottom: 0;
  }
}
.footer {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

h4 {
  text-align: left;
  margin-left: 24px;
  margin-bottom: 20px;
}
.el-button {
  width: 120px;
  background-color: #5044ff;
  color: #fff;
}
.operation {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.goHome {
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
}
</style>