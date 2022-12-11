import { reactive } from "vue";

export let state = reactive({
  ws: null,
  clientId: null,
  roomId: null,
});
