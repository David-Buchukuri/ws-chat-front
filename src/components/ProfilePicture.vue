<template>
  <div class="parent">
    <img :src="url" alt="profile pic" width="60" height="60" />
    <GreenCircleIcon :class="online ? 'online' : 'offline'" />
  </div>
</template>

<script setup>
import GreenCircleIcon from "@/components/icons/GreenCircleIcon.vue";

const props = defineProps({
  url: String,
  online: Boolean,
});
</script>

<style scoped>
img {
  border-radius: 100%;
}

.parent {
  position: relative;
}

.online {
  background-color: #5fed86;
}
.offline {
  background-color: #b5bdba;
}
</style>
