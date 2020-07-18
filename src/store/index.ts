import createStore from "unistore";
import devtools from "unistore/devtools"; ///DEV_ONLY
import jwtDecode from "jwt-decode";

import {
  addNotification,
  removeNotification
} from "@modwatch/core/src/store/index";
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
    if(!process.env.ADSENSE_ENABLED) {
      return {
        ...state,
        adsense: {
          loaded: false,
          failed: true
        }
      }
    }
    if (state.adsense.loaded || state.adsense.failed) {
      return state;
    }
    try {
      await insertScriptIntoDom(
        "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
      );
      return {
        ...state,
        adsense: {
          loaded: true,
          failed: false
        }
      };
    } catch (e) {
      store.setState(
        actions(store).addNotification(store.getState(), "Ads Blocked")
      );
      return {
        ...state,
        adsense: {
          loaded: false,
          failed: true
        }
      };
    }
  },
  addNotification,
  removeNotification
});
