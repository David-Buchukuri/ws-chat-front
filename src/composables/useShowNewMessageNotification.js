import { watch, ref, onMounted } from "vue";

const useShowNewMessageNotification = (element, state) => {
  const showNotification = ref(false);
  onMounted(() => {
    element.value.addEventListener("scroll", () => {
      let realHeight = element.value.scrollHeight;
      let distanceFromTop = element.value.scrollTop;
      let chatHeight = element.value.offsetHeight;

      if (distanceFromTop == realHeight - chatHeight) {
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

  return showNotification;
};

export default useShowNewMessageNotification;
