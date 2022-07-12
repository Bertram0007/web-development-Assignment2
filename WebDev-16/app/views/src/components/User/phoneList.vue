<template>
  <div class="phoneList">
    <el-button class="addBtn" @click="dialogVisible = true"> New </el-button>
    <el-table
        :data="tableData"
        height="450"
        style="width: 100%"
        @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column align="center" prop="title" label="Product title">
      </el-table-column>
      <el-table-column align="center" prop="brand" label="Brand">
      </el-table-column>
      <el-table-column align="center" prop="price" label="Price">
      </el-table-column>
      <el-table-column align="center" prop="stock" label="Storage">
      </el-table-column>
      <el-table-column align="center" prop="image" label="Image">
        <template slot-scope="scope">
          <el-image
            style="height: 45px;"
            :src="require(`../../assets/phone_default_images/${scope.row.image}`)"
            fit="cover" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="Operation">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" :disabled="scope.row.disabled" @click="handleDelete(scope.row)"
          >delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <addDialog :dialog-visible="dialogVisible" @close="close" />
  </div>
</template>

<script>
import addDialog from "./dialog.vue";
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
    };
  },
  methods: {
    async initData() {
      const { data } = await this.$http.get("/phonelist");
      if (data.code === 200) {
        this.tableData = data.data;
      } else {
        this.tableData = [];
        this.$message.warning("failed to get the list");
      }
    },
    async handleDelete(row) {
      this.$confirm("confirm to delete?", {
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        type: "warning",
      })
          .then(async () => {
            const { data } = await this.$http.post(
                `/phonelist/delete/${row._id}`
            );
            console.log(data);
            if (data.code === 200) {
              this.$message.success(data.message);
              await this.initData();
            } else {
              this.$message.warning(data.message);
            }
          })
          .catch((err) => {
            if (err === "cancel") {
              this.$message.info("cancel");
            } else {
              this.$message.error(err.message);
            }
          });
    },
    async close(val) {
      this.dialogVisible = false;
      if (val === "success") {
        console.log("success");
        await this.initData();
      }
    },
    handleSelectionChange(val){
      console.log(val);
      const _ids = []
      if(val.length){
        for(const i of val){
          i.disabled = true
          _ids.push(i._id)
        }
      }
      for(const i of this.tableData){
        if(!_ids.includes(i._id)) i.disabled = false
      }
    }
  },
  async mounted() {
    await this.initData();
  },
  components: {
    addDialog,
  },
};
</script>

<style lang="scss" scoped>
.phoneList {
  width: 95%;
  margin: 40px auto 0;
}
.addBtn {
  width: 120px;
  background-color: #5cb85c;
  color: #fff;
}
</style>