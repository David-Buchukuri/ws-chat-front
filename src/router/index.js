import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import ChatView from "../views/ChatView.vue";
import { state } from "../stores/wsStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/chat",
      name: "chat",
      component: ChatView,
      beforeEnter: () => {
        if (!state.ws || !state.clientId || !state.roomId) {
          return "/";
        }
      },
    },
  ],
});

export default router;
