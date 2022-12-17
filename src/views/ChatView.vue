<template>
  <div class="parent">
    <h2>chat room id: {{ state.roomId }}</h2>

    <div class="rooms">
      <h3 id="room-name"></h3>
      <div class="chat-box">
        <div class="message-box">
          <div v-for="message in messages" :key="new Date()" class="message">
            {{ message }}
          </div>
          <div class="typing" v-if="typingUser">
            {{ typingUser }} is typing...
          </div>
        </div>
        <div class="send-panel">
          <input type="text" v-model="message" @input="sendTyping" />
          <button @click="sendMessage" :disabled="!message">send</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { state } from "../stores/wsStore";
import { ref, onBeforeUnmount } from "vue";
import { onBeforeRouteLeave } from "vue-router";

const message = ref(null);
const messages = ref([]);
const typingUser = ref(null);
let typingUserTimeout;

const sendMessage = () => {
  state.ws.send(
    JSON.stringify({
      action: "message",
      value: message.value,
      clientId: state.clientId,
      roomId: state.roomId,
    })
  );
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

state.ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type == "message") {
    messages.value.push(data.value);
    if (!data.isMine) {
      typingUser.value = false;
    }
  }

  if (data.type == "join") {
    messages.value.push(data.value + " joined the chat");
  }

  if (data.type == "typing") {
    typingUser.value = data.value;
    typingUserTimeout ? clearTimeout(typingUserTimeout) : null;
    typingUserTimeout = setTimeout(() => (typingUser.value = false), 10000);
    console.log(data.value, " is typing");
  }
};

onBeforeRouteLeave(() => {
  const answer = window.confirm(
    "Do you really want to leave? you have unsaved changes!"
  );
  if (!answer) return false;
});

onBeforeUnmount(() => {
  state.ws.close();
  state.ws = null;
  state.roomId = null;
  state.clientId = null;
});
</script>

<style scoped>
.chat-box {
  border: 1px solid black;
  border-radius: 10px;
  height: 500px;
  width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.message-box {
  background-color: antiquewhite;
  height: 80%;
  overflow: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
}

.message {
  width: 100%;
  text-align: center;
}

.typing {
  text-align: left;
  margin-top: auto;
}

.send-panel {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: 20%;
  gap: 10px;
}

input {
  padding: 5px;
  outline: none;
  flex-grow: 1;
}

button {
  padding: 5px;
}

.parent {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 50px;
}
</style>
