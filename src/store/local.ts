export const getLocalState = () =>
  JSON.parse(localStorage.getItem("modwatch.user"));

export const setLocalState = state => (
  localStorage.setItem("modwatch.user", JSON.stringify(state)), state
);

export const clearLocalState = () => (
  localStorage.setItem("modwatch.user", "{}"), {}
);
