import { watch } from "vue";

const useScrollToBottomIfClose = (element, state) => {
  watch(state, () => {
    let realHeight = element.value.scrollHeight;
    let distanceFromTop = element.value.scrollTop;
    let chatHeight = element.value.offsetHeight;

    if (distanceFromTop + 100 > realHeight - chatHeight) {
      setTimeout(() => {
        element.value.scrollTop = element.value.scrollHeight + 200;
      }, 50);
    }
  });
};

export default useScrollToBottomIfClose;
