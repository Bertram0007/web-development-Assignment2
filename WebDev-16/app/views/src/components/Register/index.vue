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
        <el-form-item prop="fristname" label="fristname：">
          <el-input
              v-model="form.firstname"
              type="text"
              name="fristname"
              placeholder="please type in fristname"
          ></el-input>
        </el-form-item>
        <el-form-item prop="lastname" label="lastname：">
          <el-input
              v-model="form.lastname"
              type="text"
              name="lastname"
              placeholder="please type in lastname"
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
          <el-button type="primary" @click="submitForm()">
            Register
          </el-button>
        </el-form-item>
        <el-button @click="goToLogin()" type="primary"><span>
          Login
        </span>
        </el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
import dayjs from "dayjs";
import {mapState, mapMutations} from 'vuex'
export default {
  data() {
    return {
      timer: null,
      time: "",
      form: {},
      isLogin: true,
      rules: {
        password: [
          {required: true, message: "please type in the password", trigger: "blur"},
          {
            min: 3,
            max: 15,
            message: "length between 3 to 15 characters",
            trigger: "blur",
          },
        ],
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
          const {data} = await this.$http.post("/register", this.form);
          if (data.code === 200) {
            this.SET_USER(data.data[0])
            this.$router.push("/user");
            this.$message.success("success");
          } else {
            this.$message.warning(data.message);
          }
        } else {
          return false;
        }
      });
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