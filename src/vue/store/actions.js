import fetch from "unfetch";

export function getModlists({ commit }) {
  return get("http://192.168.86.25:3001/api/users/list/25")
  .then(users => {
    commit("modlists", users);
    return users;
  });
}

export function getModlist({ commit }, username) {
  return get(`http://localhost:3001/api/user/${username}/all`)
  .then(modlist => {
    commit("modlist", modlist);
    return modlist;
  });
}

export function getModlistFileType({ commit }, {username, filetype}) {
  return get(`http://localhost:3001/api/user/${username}/file/${filetype}`)
  .then(file => {
    commit("filetype", {
      type: filetype,
      value: file
    });
    return file;
  });
}

function get(url) {
  return fetch(url, {
    method: "GET"
  })
  .then(res => res.json());
}
