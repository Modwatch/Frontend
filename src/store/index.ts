import createStore from "unistore";
import devtools from "unistore/devtools"; // stripped in rolup for prod
import jwtDecode from "jwt-decode";

import { clearLocalState, setLocalState } from "./local";

import { GlobalState } from "../types";

const user = JSON.parse(localStorage.getItem("modwatch.user") || "{}");

const _store = createStore({
  notifications: [],
  user: user.username ? user : undefined
});

export const store = devtools(_store); // stripped in rollup for prod

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
