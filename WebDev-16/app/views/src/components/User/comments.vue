<template>
  <div class="comments">
    <div v-for="v in tableData" :key="v._id">
      <h3>Title：{{ v.title }}</h3>
      <h4>Brand：{{ v.brand }}</h4>
      <h4>Content：</h4>
      <div class="contents" v-for="v2 in v.reviews" :key="v2.reviewer">
        <div class="comment">{{ v2.comment || "no comments" }}</div>
        <div class="user">BY User: {{ v2.reviewer }}</div>
      </div>
      <h4> ---------------------------------------------------------------------------------------------------------------------------------------------------------------- </h4>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
    };
  },

  async created() {
    await this.initData();
  },

  methods: {
    async initData() {
      const { data } = await this.$http.get("/phonelist");
      if (data.code === 200) {
        this.tableData = data.data;
        console.log(this.tableData);
      } else {
        this.tableData = [];
        this.$message.warning("failed to get form data");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.comments {
  width: 95%;
  margin: 40px auto 0;
  .contents {
    .user {
      text-align: right;
      margin: 5px 0;
    }
  }
}
</style>