const API_URL = process.env.MODWATCH_API_URL;

export function getModlists({ commit }) {
  return get(`${API_URL}/api/users/list/25`).then(users => {
    commit("modlists", users);
    return users;
  });
}

export function searchModlists({ commit }, { filter }) {
  return get(`${API_URL}/api/search/users/${encodeURIComponent(filter)}/25`).then(users => {
    commit("modlists", users);
    return users;
  });
}

export function getModlist({ commit }, username) {
  return get(`${API_URL}/api/user/${encodeURIComponent(username)}/all`).then(modlist => {
    commit("modlist", modlist);
    return modlist;
  });
}

export function getModlistFileType({ commit }, { username, filetype }) {
  return get(`${API_URL}/api/user/${encodeURIComponent(username)}/file/${filetype}`).then(file => {
    commit("filetype", {
      type: filetype,
      value: file
    });
    return file;
  });
}

export function login({ commit, dispatch }, { username, password }) {
  return post(`${API_URL}/oauth/login`, {
    body: { username, password }
  }).then(res => {
    return dispatch("notification", { notification: "Logged In" }).then(
      () => res
    );
  });
}

export function logout({ commit, dispatch }) {
  commit("logout");
  return dispatch("notification", { notification: "Logged Out" });
}

export function verify({ state }, { access_token } = {}) {
  return fetch(`${API_URL}/oauth/verify?t=${new Date().getTime()}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token || state.user.token}`
    }
  }).then(res => res.status === 200);
}

export function deleteModlist({ state, dispatch }, { username, password }) {
  const isAdmin = state.user.scopes.indexOf("admin") !== -1;
  if (
    !isAdmin &&
    username !== state.user.username
  ) {
    return Promise.reject(
      `${state.user.scopes.join(
        ","
      )} does not include admin, and ${username} does not equal ${
        state.user.username
      }`
    );
  }
  return fetch(`${API_URL}/api/user/${encodeURIComponent(username)}/delete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${state.user.token}`
    },
    body: JSON.stringify({
      password
    })
  })
    .then(res => res.status === 200)
    .then(valid =>
      dispatch("notification", {
        notification: valid
          ? `Deleted ${username}`
          : `Couldn't Delete ${username}`
      }).then(() => valid)
    )
    .catch(() => {
      this.$store.dispatch("notification", {
        notification: `Couldn't Delete ${username}`
      });
      return false;
    });
}

export function notification({ commit }, { notification, delay = 3000 }) {
  commit("pushNotification", notification);
  setTimeout(() => {
    commit("popNotification");
  }, delay);
}

function get(url) {
  return fetch(url, {
    method: "GET"
  }).then(res => res.json());
}

function p(url, { body, token }, method) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: token
      ? {
          Authorization: `Bearer ${token}`
        }
      : undefined
  }).then(res => res.json());
}

function post(url, { body, token }) {
  return p(url, { body, token }, "POST");
}

function put(url, { body, token }) {
  return p(url, { body, token }, "PUT");
}
