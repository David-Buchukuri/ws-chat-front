import { watch, ref, onMounted, onBeforeUnmount } from "vue";

const useShowNewMessageNotification = (element, state) => {
  const showNotification = ref(false);

  let scrollEventListener;

  onMounted(() => {
    scrollEventListener = element.value.addEventListener("scroll", () => {
      let realHeight = element.value.scrollHeight;
      let distanceFromTop = element.value.scrollTop;
      let chatHeight = element.value.offsetHeight;

      if (distanceFromTop == realHeight - chatHeight - 25) {
        showNotification.value = false;
      }
    });

    watch(state, () => {
      let realHeight = element.value.scrollHeight;
      let distanceFromTop = element.value.scrollTop;
      let chatHeight = element.value.offsetHeight;

      if (distanceFromTop + 100 <= realHeight - chatHeight) {
        showNotification.value = true;
      }
    });
  });

  onBeforeUnmount(() => {
    element.value.removeEventListener("scroll", scrollEventListener);
  });

  return showNotification;
};

export default useShowNewMessageNotification;
