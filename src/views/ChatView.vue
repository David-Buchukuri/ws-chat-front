<template>
  <div class="parent">
    <h2 class="room-id">chat room id: {{ state.roomId }}</h2>

    <div class="chat-box">
      <MessageBox
        :messages="messages"
        :typingUser="typingUser"
        :clientsOnline="clientsOnline"
      />

      <form class="send-panel" @submit.prevent="sendMessage">
        <input type="text" v-model="message" @input="sendTyping" ref="input" />
        <EmojiPicker
          v-if="emojiVisible"
          class="emoji-popup"
          :native="true"
          @select="onSelectEmoji"
          v-click-outside="emojiBlur"
        />
        <div class="emoji-popup-label" @click="emojiVisible = !emojiVisible">
          😀️
        </div>
        <button :disabled="!message">send</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { state } from "../stores/wsStore";
import { ref, onBeforeUnmount, provide } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import EmojiPicker from "vue3-emoji-picker";
import "vue3-emoji-picker/css";
import MessageBox from "@/components/MessageBox.vue";

const emojiVisible = ref(false);
const input = ref(null);

const emojiBlur = () => {
  emojiVisible.value = false;
};

const onSelectEmoji = (emoji) => {
  let selectionStart = input.value.selectionStart;
  let selectionEnd = input.value.selectionEnd;

  let firstPart = message.value.substring(0, selectionStart);
  let secondPart = message.value.substring(selectionEnd);

  message.value = firstPart + emoji.i + secondPart;

  const nextPosition = selectionStart + 2;

  setTimeout(
    () => input.value.setSelectionRange(nextPosition, nextPosition),
    10
  );
};

const message = ref("");

const sendMessage = () => {
  state.ws.send(
    JSON.stringify({
      action: "message",
      value: message.value,
      clientId: state.clientId,
      roomId: state.roomId,
    })
  );
  message.value = "";
};

const sendTyping = () => {
  state.ws.send(
    JSON.stringify({
      action: "typing",
      clientId: state.clientId,
      roomId: state.roomId,
    })
  );
};

const messages = ref([]);

const typingUser = ref(false);
provide("typingUser", typingUser);
let typingUserTimeout;

const clientsOnline = ref([]);

state.ws.onmessage = (e) => {
  const data = JSON.parse(e.data);

  if (data.type == "typing") {
    typingUser.value = data.value;
    typingUserTimeout ? clearTimeout(typingUserTimeout) : null;
    typingUserTimeout = setTimeout(() => (typingUser.value = false), 3000);
  }

  if (data.type == "message") {
    messages.value.push({
      value: data.value,
      isMine: data.isMine,
      pfp: data.pfp ?? `${import.meta.env.VITE_BACKEND_URL}/default`,
      nickname: data.nickname,
      type: "message",
    });
    if (!data.isMine) {
      typingUser.value = false;
    }
  }

  if (data.type == "join") {
    messages.value.push({
      value: data.value.substring(41) + " joined the chat",
      isMine: null,
      type: "notification",
    });
    clientsOnline.value = data.onlineClients;
  }

  if (data.type == "leave") {
    messages.value.push({
      value: data.value.substring(41) + " left the chat",
      isMine: null,
      type: "notification",
    });

    clientsOnline.value = data.onlineClients;
  }
};

onBeforeRouteLeave(() => {
  const answer = window.confirm(
    "Do you really want to leave? your messages won't be persisted"
  );
  if (!answer) return false;
});

const confirmExit = (evt) => {
  evt.returnValue = false;
};

window.addEventListener("beforeunload", confirmExit);

onBeforeUnmount(() => {
  state.ws.close();
  state.ws = null;
  state.roomId = null;
  state.clientId = null;
  window.removeEventListener("beforeunload", confirmExit);
});
</script>

<style scoped>
.emoji-popup {
  position: absolute;
  right: 0;
  margin-top: -450px;
  height: 40vh;
  min-height: 40vh;
}

.emoji-popup-label {
  scale: 1.4;
  cursor: pointer;
}

.parent {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
}

.chat-box {
  border: 1px solid black;
  border-radius: 10px;
  height: 80%;
  width: 80%;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
}

.send-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 20%;
  gap: 10px;
  position: relative;
}

input {
  padding: 5px;
  flex-grow: 1;
}

button {
  padding: 5px;
}

.room-id {
  font-size: 20px;
  text-align: center;
  word-break: break-all;
  max-width: 80%;
}
</style>
