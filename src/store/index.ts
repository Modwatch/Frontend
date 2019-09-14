import createStore from "unistore";
import devtools from "unistore/devtools"; ///DEV_ONLY
import jwtDecode from "jwt-decode";

import { clearLocalState, setLocalState, getLocalState } from "./local";
import { insertScriptIntoDom } from "./dom";

import { GlobalState } from "../types";

const user = getLocalState();

export const rawState = {
  notifications: [],
  user: user.username ? user : undefined,
  adsense: {
    loaded: false,
    failed: false
  }
};

let _store = createStore(rawState);

_store = devtools(_store); ///DEV_ONLY
export const store = _store;

let notificationCounter = 0;

export const actions = store => ({
  login(state: GlobalState, token) {
    const { sub, scopes } = jwtDecode(token);
    const user = {
      token,
      authenticated: true,
      username: sub,
      scopes
    };
    setLocalState(user);
    return {
      ...state,
      user
    };
  },
  logout(state: GlobalState) {
    clearLocalState();
    return {
      ...state,
      user: undefined
    };
  },
  async loadAdsenseAds(state: GlobalState) {
    if(state.adsense.loaded || state.adsense.failed) {
      return state;
    }
    try {
      await insertScriptIntoDom("https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js");
      return {
        ...state,
        adsense: {
          loaded: true,
          failed: false
        }
      };
    } catch(e) {
      store.setState(actions(store).addNotification(store.getState(), "Ads Blocked"));
      return {
        ...state,
        adsense: {
          loaded: false,
          failed: true
        }
      }
    }
  },
  addNotification(
    state: GlobalState,
    message: string,
    {
      type = "info",
      delay = 3000,
      removalDelay = 300
    }: {
      type?: string;
      delay?: number;
      removalDelay?: number;
    } = {}
  ) {
    const _id = `${notificationCounter++}`;
    return {
      ...state,
      notifications: state.notifications.concat({
        message,
        removalDelay,
        delay,
        _id,
        type,
        softDelete: false
      })
    };
  },
  /* ok then */
  removeNotification(state: GlobalState, _id: string) {
    const onlyActiveIndex = state.notifications
      .map(({ softDelete }) => softDelete)
      .indexOf(false);
    if (onlyActiveIndex === 0 && state.notifications[0]._id === _id) {
      notificationCounter = 0;
      return { notifications: [] };
    }
    const index = state.notifications.map(({ _id }) => _id).indexOf(_id);
    if (index !== -1) {
      return {
        ...state,
        notifications: state.notifications
          .slice(0, index)
          .concat({
            ...state.notifications[index],
            softDelete: true
          })
          .concat(state.notifications.slice(index + 1))
      };
    }
  }
});
