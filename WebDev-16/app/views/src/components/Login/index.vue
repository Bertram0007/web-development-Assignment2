
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
              placeholder="please type in email"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password" label="password:">
          <el-input
              v-model="form.password"
              type="password"
              name="password"
              placeholder="please type in password"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm()"><span>
            Login
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
          <el-button @click="goToResetPwd()" type="primary"><span>
          Forget Password?
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
            },
          },
        ],
        password: [
          {required: true, message: "please type in the password", trigger: "blur"},
          {
            min: 3,
            max: 10,
            message: "length between 3 to 10 characters",
            trigger: "blur",
          },
        ],
      },
    };
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
          const {data} = await this.$http.post("/login", this.form);
          console.log(data);
          if (data.code === 200) {
            this.SET_USER(data.data[0])
            this.$router.push(this.$route.query.redirect || "/home");
            this.$message.success("success");
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
    goToResetPwd() {
      this.$router.push('/resetpwd')
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
    top: 20%;
    font-size: 36px;
    cursor: pointer;
    transition: 0.25s;
    &:hover {
      transform: scale(1.2);
    }
  }
  .login {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
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
  .el-link{
    position: absolute;
    bottom: -30px;
    right: 0;
  }
}
</style>
