const ws = new WebSocket("ws://127.0.0.1:8005");
const input = document.querySelector("input");
const button = document.querySelector("button");
const chatBox = document.querySelector(".chat-box");
const ul = document.querySelector("ul");
const roomName = document.getElementById("room-name");
let selectedRoom;
let clientId;

const rooms = ["js", "python", "php"];

rooms.forEach((room) => {
  const element = document.createElement("li");
  element.innerHTML = room;
  element.addEventListener("click", (e) => {
    selectedRoom = room;
    roomName.innerHTML = selectedRoom + " chat room";
    ws.send(
      JSON.stringify({ action: "join", room: selectedRoom, clientId: clientId })
    );
  });
  ul.appendChild(element);
});

ws.onmessage = (e) => {
  const data = JSON.parse(e.data);

  if (data.type == "message") {
    const element = document.createElement("span");
    element.innerHTML = data.value;
    chatBox.appendChild(element);
  }
  if (data.type == "clientId") {
    clientId = data.value;
  }
};

window.addEventListener("beforeunload", () => {
  ws.close();
});

button.addEventListener("click", (e) => {
  ws.send(
    JSON.stringify({
      action: "message",
      value: input.value,
      clientId: clientId,
    })
  );
});
