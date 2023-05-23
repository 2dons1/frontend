<template>
  <div v-if="$store.state.isUserLoggedIn">
    You are logged in.
    <div>{{ $store.state.user.id }}</div>
    <div>{{ $store.state.user.email }}</div>
    <div>{{ $store.state.user.role }}</div>
  </div>
  <div v-else>
    You are NOT logged in.
  </div>
  
</template>

<script>

export default {
  name: '',
  components: {

  },
  data() {
      return {

      }
  }, 
  methods: {

  }
}
</script>

<style scoped>
  
</style>