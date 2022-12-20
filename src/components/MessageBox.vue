<template>
  <div ref="messageBox" class="message-box">
    <div
      v-for="message in messages"
      :key="new Date()"
      :class="{
        'my-message': message.isMine,
        'guest-message': message.isMine === false,
        message: message.isMine === true || message.isMine === false,
        notification: message.isMine === null,
      }"
    >
      <ProfilePicture v-if="message.isMine === false" :url="message.pfp" />
      <div
        class="message-text"
        :class="{
          'my-message-text': message.isMine,
          'guest-message-text': message.isMine === false,
          'notification-message-text': message.isMine === null,
        }"
      >
        {{ message.value }}
      </div>
      <ProfilePicture v-if="message.isMine" :url="message.pfp" />
    </div>

    <div class="typing" v-if="typingUser">{{ typingUser }} is typing...</div>
  </div>
</template>

<script setup>
import ProfilePicture from "./ProfilePicture.vue";
import { ref, watch, onMounted, watchEffect } from "vue";
import { inject } from "vue";
import useScrollToBottomIfClose from "@/composables/useScrollToBottomIfClose.js";

const props = defineProps({
  messages: Array,
});

const typingUser = inject("typingUser");

const messageBox = ref(null);

watch(props.messages, () => {
  useScrollToBottomIfClose(messageBox);
});

watch(typingUser, () => {
  useScrollToBottomIfClose(messageBox);
});
</script>

<style>
.message-box {
  background-color: antiquewhite;
  height: 80%;
  overflow: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  scroll-behavior: smooth;
}

.message {
  max-width: 70%;
  padding: 5px;
  border-radius: 5px;
  display: flex;
  gap: 10px;
  width: fit-content;
}

.my-message {
  align-self: flex-end;
  justify-content: flex-end;
}
.guest-message {
  align-self: flex-start;
  justify-content: flex-start;
}

.message-text {
  max-width: 80%;
  width: fit-content;
  overflow-wrap: break-word;
  padding: 10px;
  border-radius: 10px;
  height: fit-content;
}

.my-message-text {
  text-align: right;
  color: white;
  background-color: rgb(117, 117, 226);
}
.guest-message-text {
  text-align: left;
  color: black;
  background-color: rgb(197, 197, 197);
}

.notification {
  width: 100%;
  inline-size: 95%;
  overflow-wrap: break-word;
  padding: 0px 5px 40px 5px;
  font-style: italic;
  align-self: center;
  justify-content: center;
  display: flex;
}

.typing {
  text-align: left;
  margin-top: auto;
}
</style>
