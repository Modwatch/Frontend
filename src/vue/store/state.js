export const modlist = {
  timestamp: undefined,
  tag: "",
  game: "skyrim",
  enb: "",
  files: {
    plugins: 0,
    modlist: 0,
    ini: 0,
    prefsini: 0
  },
  plugins: [],
  modlist: [],
  ini: [],
  prefsini: [],
  enblocal: [],
  skse: []
};

export const user = {
  authenticated: false,
  username: undefined,
  token: undefined,
  scopes: []
};

export const initialState = {
  modlists: [],
  modlistfilter: "",
  showInactiveMods: false,
  modlist,
  notifications: [],
  user: {
    ...user,
    ...JSON.parse(localStorage.getItem("modwatch.user") || "{}")
  }
};

export const state = {
  ...initialState
};

export const USER_MUTATIONS = ["login", "logout"];

export const plugins = [
  store => {
    store.subscribe((mutation, state) => {
      if (USER_MUTATIONS.indexOf(mutation)) {
        localStorage.setItem("modwatch.user", JSON.stringify(state.user));
      }
    });
  }
];
