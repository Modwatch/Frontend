import "unfetch/polyfill";

export function login(auth) {
    return Promise.resolve(localStorage.setItem("modwatch.auth", JSON.stringify(auth)), auth);
}

export function logout() {
    return Promise.resolve(localStorage.setItem("modwatch.auth", "{}"), {});
}

export function getAuth() {
    return Promise.resolve(JSON.parse(localStorage.getItem("modwatch.auth")));
}

export function verify(auth) {
    return fetch(
      `${process.env.API_URL}/oauth/verify?t=${new Date().getTime()}`,
      {
          headers: {
              "Content-Type": "application/json",
          Authorization: `Bearer ${auth.access_token}`
        }
      }
    ).then(res => res.json());
}