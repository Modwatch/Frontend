import fetch from "unfetch";

const URL = "http://192.168.86.25:3001";

export function getModlists({ commit }) {
  return get(`${URL}/api/users/list/25`)
  .then(users => {
    commit("modlists", users);
    return users;
  });
}

export function getModlist({ commit }, username) {
  return get(`${URL}/api/user/${username}/all`)
  .then(modlist => {
    commit("modlist", modlist);
    return modlist;
  });
}

export function getModlistFileType({ commit }, {username, filetype}) {
  return get(`${URL}/api/user/${username}/file/${filetype}`)
  .then(file => {
    commit("filetype", {
      type: filetype,
      value: file
    });
    return file;
  });
}

export function login({ commit }, {username, password}) {
  return post(`${URL}/oauth/login`, {
    body: { username, password }
  });
}

export function verify() {
  return fetch(`${URL}/oauth/verify?t=${new Date().getTime()}`).then(res => res.status === 200);
}

function get(url) {
  return fetch(url, {
    method: "GET"
  })
  .then(res => res.json());
}

function post(url, { body, token }) {
  return fetch(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: token ? {
      "Authorization": `Bearer ${token}`
    } : undefined
  })
  .then(res => res.json());
}
