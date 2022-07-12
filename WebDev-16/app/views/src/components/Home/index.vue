<template>
  <div>
    <TopNavigation />
    <keep-alive>
       <router-view />
    </keep-alive>
  </div>
</template>

<script>
import TopNavigation from "../TopNavigation.vue"
export default {
  components: {
    TopNavigation
  },
  data() {
    return {

    }
  },
}

</script>

<style scoped>
.Home{
  padding-top: 86px;
}
</style>