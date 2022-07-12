<template>
  <div class="profile">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px">
      <el-form-item label="last-name：">
        <el-input v-model="form.firstname"></el-input>
      </el-form-item>
      <el-form-item label="first-name：">
        <el-input v-model="form.lastname"></el-input>
      </el-form-item>
      <el-form-item prop="email" label="email：">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <!-- <el-form-item> -->
      <el-button @click="onSubmit">Update data</el-button>
      <!-- </el-form-item> -->
    </el-form>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      form: {
        firstname: "",
        lastname: "",
        email: "",
      },
      rules: {
        email: [{ required: true, message: "please type in the email", trigger: "blur" }],
      },
    };
  },
  methods: {
    ...mapMutations(["SET_USER"]),
    async onSubmit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.$prompt("please type in the password", "instruction", {
            confirmButtonText: "confirm",
            cancelButtonText: "cancel",
          })
              .then(async ({ value }) => {
                const { data } = await this.$http.post(`/user/verify/${value}`, {
                  email: this.form.email,
                });
                if (data.code !== 200) {
                  this.$message.warning(data.message);
                } else {
                  const { data } = await this.$http.post(
                      `/user/update/${this.form._id}`,
                      this.form
                  );
                  if (data.code === 200) {
                    this.SET_USER(this.form);
                    this.$message.success("update success");
                  } else {
                    this.$message.warning("update failed");
                  }
                }
              })
              .catch(() => {
                this.$message.error("operation failed");
              });
        }
      });
    },
  },
  computed: {
    ...mapState(["user"]),
  },
  mounted() {
    Object.assign(this.form, this.user);
    console.log(this.form);
  },
};
</script>

<style lang="scss" scoped>
.profile {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
}
.el-button {
  width: 100%;
  background-color: #5044ff;
  color: #fff;
}
</style>