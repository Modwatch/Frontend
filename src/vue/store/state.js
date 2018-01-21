export const modlist = {
  "timestamp": undefined,
  "tag": undefined,
  "game": "skyrim",
  "enb": undefined,
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

export const state = {
  modlists: undefined,
  modlistfilter: "",
  showInactiveMods: false,
  modlist,
  notifications: [],
  user: {...user, ...JSON.parse(localStorage.getItem("modwatch.user") || "{}")},
  gameMap: {
    skyrim: "Skyrim Classic",
    skyrimse: "Skyrim SE",
    fallout4: "Fallout 4"
  }
};

export const USER_MUTATIONS = [
  "login",
  "logout"
];

export const plugins = [
  store => {
    store.subscribe((mutation, state) => {
      if(USER_MUTATIONS.indexOf(mutation)) {
        localStorage.setItem("modwatch.user", JSON.stringify(state.user));
      }
    });
  }
]
