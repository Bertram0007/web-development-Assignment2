<template>
  <div class="Login">
    <div class="time">
      <div class="time-content">
        {{ time }}
      </div>
    </div>
    <!-- <input type="text" size="30" placeholder="Search" class="search" /> -->
    <div class="login" ref="login">
      <el-form ref="form" :rules="rules" :model="form" label-position="left">
        <el-form-item prop="email" label="email：">
          <el-input
              v-model="form.email"
              type="text"
              name="email"
              placeholder="please type your register email"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()"><span>
            Sent the email
          </span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="goToRegister()" type="primary"><span>
          Register
        </span>
          </el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="goToLogin()" type="primary"><span>
          Go to login
        </span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {mapMutations, mapState} from 'vuex'
export default {
  data() {
    return {
      redirect: '',
      timer: null,
      time: "",
      form: {},
      isLogin: true,
      rules: {
        email: [
          {
            required: true,
            message: "please type in the email",
            trigger: "blur",
            validator: (rule, value, callback) => {
              if (value === "") {
                this.$message.error("The email can't be null");
                return;
              }
              if (
                  !/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/.test(
                      value
                  )
              ) {
                this.$message.error("The format of email is wrong");
                return;
              }
              callback();
            }
          }
        ],
      },
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = decodeURIComponent(route.fullPath).split('redirect=')[1]
      },
      immediate: true
    }
  },
  computed: {
    ...mapState(['user'])
  },
  mounted() {
    this.timer = setInterval(() => {
      this.time = dayjs().format("HH:mm");
    }, 1000);
  },
  methods: {
    ...mapMutations(['SET_USER']),
    submitForm() {
      // console.log(this.$refs.login);
      // console.log(document.getElementsByClassName(' login'))
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          const {data} = await this.$http.post("/resetpwd", this.form);
          if (data.code === 200) {
            this.$message.success("A email has been sent");
          } else {
            this.$message.warning(data.message);
          }
        } else {
          return false;
        }
      });
    },
    goToRegister() {
      this.$router.push('/register')
    },
    goToLogin() {
      this.$router.push('/login')
    }
  },
};
</script>

<style lang="scss" scoped>
.Login {
  width: 100%;
  height: 100%;
  background: url("../../assets/images/BG_A_Default_2.jpg") center no-repeat;
  background-size: cover;
  position: relative;
  input::-webkit-input-placeholder {
    color: #fff;
  }
  .time {
    position: fixed;
    width: 100px;
    left: 50%;
    margin-left: -50px;
    top: 115px;
    font-size: 36px;
    cursor: pointer;
    transition: 0.25s;
    &:hover {
      transform: scale(1.2);
    }
  }
  .search {
    position: absolute;
    width: 230px;
    top: 200px;
    left: 50%;
    max-width: 80%;
    padding: 13px 15px;
    transform: translateX(-50%);
    outline: 0;
    border: none;
    border-radius: 30px;
    font-size: small;
    font-weight: 400;
    font-family: "Microsoft Yahei", sans-serif;
    text-align: center;
    background-color: rgba(255, 255, 255, 0.25);
    color: rgba(255, 255, 255, 0.8);
    transition: color 0.25s, background-color 0.25s, box-shadow 0.25s,
    left 0.25s, opacity 0.25s, top 0.25s, width 0.25s;
    &:focus {
      color: #000;
      background-color: rgba(255, 255, 255, 0.9);
      width: 530px;
    }
    &:hover {
      width: 530px;
    }
  }
  .login {
    width: 300px;
    position: absolute;
    left: 50%;
    top: 25%;
    transform: translate(-50%);
    /deep/ .el-form-item__label {
      color: rgba(255, 255, 255, 0.6);
      font-weight: 500;
    }
    .el-input__inner {
      border-top: none;
    }
    .el-button {
      width: 100%;
    }
  }
}
</style>