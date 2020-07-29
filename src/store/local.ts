export const getLocalState = () => {
  const user = localStorage.getItem("modwatch.user");
  if (!user) {
    return {};
  }
  try {
    return JSON.parse(user);
  } catch (e) {
    console.log(`Failed to parse saved user: "${user}"`, e);
    return clearLocalState();
  }
};

export const setLocalState = (state) => (
  localStorage.setItem("modwatch.user", JSON.stringify(state)), state
);

export const clearLocalState = () => (
  localStorage.setItem("modwatch.user", "{}"), {}
);
