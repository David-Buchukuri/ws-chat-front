<template>
  <main>
    <h1>anonymous one on one chat</h1>
    <section>
      <div class="d-flex-col-gap">
        <h3>Create Your Own Chat Room</h3>
        <button @click="createRoom">Create Chat Room</button>
        <div v-if="roomIdFromResponse" class="room-id-input-wrapper">
          <span>chat room id: {{ roomIdFromResponse }}</span>
          <CopyIcon
            @click="copyRoomId"
            :color="copyIconColor"
            class="copy-icon"
          />
        </div>
      </div>
      <form @submit.prevent="joinChat" class="d-flex-col-gap">
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
        <button :disabled="!roomIdFromInput">Join</button>
      </form>
    </section>
  </main>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { state } from "../stores/wsStore";
import CopyIcon from "@/components/icons/CopyIcon.vue";

const router = useRouter();

const error = ref(false);
const roomIdFromInput = ref(null);
const roomIdFromResponse = ref(null);
const copyIconColor = ref("black");

const copyRoomId = () => {
  copyIconColor.value = "green";
  setTimeout(() => (copyIconColor.value = "black"), 2000);
  navigator.clipboard.writeText(roomIdFromResponse.value);
};

const createRoom = async () => {
  const responsePromise = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/create-room`
  );
  const response = await responsePromise.json();
  roomIdFromResponse.value = response.roomId;
};

const joinChat = () => {
  const ws = new WebSocket(
    `${import.meta.env.VITE_BACKEND_WS_URL}/?roomId=${roomIdFromInput.value}`
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

.d-flex-col-gap {
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

.copy-icon {
  width: 22px;
  opacity: 0.9;
  cursor: pointer;
}

.copy-icon:hover {
  scale: 1.07;
}

.room-id-input-wrapper {
  display: flex;
  gap: 20px;
  align-items: center;
}
</style>
