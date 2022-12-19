<template>
  <div>
    <img :src="url" alt="profile pic" width="60" height="60" />
  </div>
</template>

<script setup>
defineProps({
  url: String,
});
</script>

<style scoped>
img {
  border-radius: 100%;
}
</style>
