<template>
  <main>
    <h1>anonymous chat</h1>
    <section>
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
        <span v-if="error" class="error"
          >room id is invalid or the room is full
        </span>
        <button @click="joinChat" :disabled="!roomIdFromInput">Join</button>
      </div>
    </section>
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
  };

  ws.onmessage = (e) => {
    const data = JSON.parse(e.data);

    if (data.type == "clientId") {
      state.clientId = data.value;
      state.roomId = roomIdFromInput.value;
      state.ws = ws;
      router.push("/chat");
    }
  };
};
</script>

<style scoped>
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
section {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 50px;
}

main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 200px;
  height: 80vh;
}
</style>
