const useScrollToBottomIfClose = (element) => {
  let realHeight = element.value.scrollHeight;
  let distanceFromTop = element.value.scrollTop;
  let chatHeight = element.value.offsetHeight;

  // if scroll is near the bottom or at the bottom scroll all the way to the bottom
  if (distanceFromTop + 100 > realHeight - chatHeight) {
    setTimeout(() => {
      element.value.scrollTop = element.value.scrollHeight + 200;
    }, 50);
  }
};

export default useScrollToBottomIfClose;
