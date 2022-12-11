<template>
  <div class="parent">
    <h2>chat room id: {{ state.roomId }}</h2>

    <div class="rooms">
      <h3 id="room-name"></h3>
      <div class="chat-box">
        <span v-for="message in messages" :key="new Date()" class="message">{{
          message
        }}</span>
      </div>
    </div>
    <input type="text" v-model="message" />
    <button @click="send" :disabled="!message">send</button>
  </div>
</template>

<script setup>
import { state } from "../stores/wsStore";
import { ref } from "vue";

const message = ref(null);
const messages = ref([]);

const send = () => {
  state.ws.send(
    JSON.stringify({
      action: "message",
      value: message.value,
      clientId: state.clientId,
      roomId: state.roomId,
    })
  );
};

state.ws.onmessage = (e) => {
  const data = JSON.parse(e.data);
  if (data.type == "message") {
    messages.value.push(data.value);
  }
};
</script>

<style scoped>
.chat-box {
  border: 1px solid black;
  border-radius: 10px;
  height: 200px;
  width: 300px;
  padding: 10px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>
