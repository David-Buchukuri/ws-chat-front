<template>
  <div class="parent">
    <h2>chat room id: {{ state.roomId }}</h2>

    <div class="chat-box">
      <div class="message-box">
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
          {{ message.value }}
        </div>
        <div class="typing" v-if="typingUser">
          {{ typingUser }} is typing...
        </div>
      </div>
      <form class="send-panel" @submit.prevent="sendMessage">
        <input type="text" v-model="message" @input="sendTyping" />
        <button :disabled="!message">send</button>
      </form>
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
  message.value = null;
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
    messages.value.push({ value: data.value, isMine: data.isMine });
    if (!data.isMine) {
      typingUser.value = false;
    }
  }

  if (data.type == "join") {
    messages.value.push({
      value: data.value + " joined the chat",
      isMine: null,
    });
  }

  if (data.type == "leave") {
    messages.value.push({ value: data.value + " left the chat", isMine: null });
  }

  if (data.type == "typing") {
    typingUser.value = data.value;
    typingUserTimeout ? clearTimeout(typingUserTimeout) : null;
    typingUserTimeout = setTimeout(() => (typingUser.value = false), 3000);
    console.log(data.value, " is typing");
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
.parent {
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* background-color: rgb(187, 187, 187); */
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
  justify-content: space-between;
}
.message-box {
  background-color: antiquewhite;
  height: 80%;
  overflow: auto;
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.message {
  width: 100%;
  max-inline-size: 80%;
  inline-size: auto;
  overflow-wrap: break-word;
  padding: 5px;
  border-radius: 5px;
}

.notification {
  width: 100%;
  text-align: center;
  inline-size: 95%;
  overflow-wrap: break-word;
  padding: 0px 5px 40px 5px;
  font-style: italic;
  align-self: center;
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

.my-message {
  text-align: right;
  align-self: flex-end;
  color: white;
  background-color: rgb(117, 117, 226);
}
.guest-message {
  text-align: left;
  align-self: flex-start;
  color: black;
  background-color: rgb(197, 197, 197);
}
</style>
