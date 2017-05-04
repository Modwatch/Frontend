import fetch from "unfetch";

export function getModlists({ commit }) {
  return get("http://localhost:3001/api/users/list/25")
  .then(users => {
    commit("modlists", users);
    return users;
  });
}

function get(url) {
  return fetch(url, {
    method: "GET"
  })
  .then(res => res.json());
}
