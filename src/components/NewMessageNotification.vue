<template>
  <div @click="scrollToBottom" class="new-message-notification">
    you have new messages to see ⬇️
  </div>
</template>

<script setup>
const props = defineProps({
  elementToScroll: HTMLDivElement | null,
});

const scrollToBottom = () => {
  props.elementToScroll.scrollTop = props.elementToScroll.scrollHeight;
};
</script>

<style scoped>
.new-message-notification {
  padding: 10px;
  border-radius: 10px;
  background-color: rgb(169, 97, 236);
  color: white;
  font-weight: 600;
  position: absolute;
  margin-top: 50vh;
  margin-left: 50vw;
  transform: translateX(-100%);
  cursor: pointer;
}
</style>
