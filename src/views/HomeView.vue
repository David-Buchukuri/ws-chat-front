<template>
  <main>
    <div>
      <h3>Create Your Own Chat Room</h3>
      <button @click="createRoom">Create Chat Room</button>
      <span v-if="roomIdFromResponse"
        >chat room id: {{ roomIdFromResponse }}</span
      >
    </div>
    <div>
      <h3>Already Have A Code?</h3>
      <h3>Join The Room!</h3>
      <input
        type="text"
        placeholder="enter room id"
        v-model="roomIdFromInput"
      />
      <span v-if="error" class="error">invalid room id</span>
      <button @click="joinChat" :disabled="!roomIdFromInput">Join</button>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { state } from "../stores/wsStore";

const router = useRouter();

const error = ref(false);
const roomIdFromInput = ref(null);
const roomIdFromResponse = ref(null);

const createRoom = async () => {
  const responsePromise = await fetch("http://127.0.0.1:8005/create-room");
  const response = await responsePromise.json();
  roomIdFromResponse.value = response.roomId;
};

const joinChat = () => {
  const ws = new WebSocket(
    `ws://127.0.0.1:8005?roomId=${roomIdFromInput.value}`
  );
  ws.onerror = function (err) {
    error.value = true;
    console.log(err.value);
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);
    console.log(e.data);
    if (data.type == "clientId") {
      state.clientId = data.value;
      state.roomId = roomIdFromInput.value;
      console.log(state);
      router.push("/chat");
    }
  };

  state.ws = ws;
};
</script>

<style>
.error {
  color: red;
}

div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px;
}

input {
  padding: 5px;
}

button {
  padding: 5px;
}

span {
  font-style: italic;
}
main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 100vh;
  gap: 50px;
}
</style>
