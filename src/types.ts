import { Game, Modlist } from "@modwatch/types";

declare global {
  namespace JSX {
    type Element = preact.JSX.Element;
  }
}

export type User = {
  authenticated: boolean;
  username: string;
  token?: string;
  scopes: string[];
};

export type Line = {
  descriptor?: string;
  type?: string;
  index: number;
  hide?: boolean;
  content?: {
    class: string;
    display: string;
  }[];
};

export type PartialModlist = Modlist & {
  username: string;
  game: Game;
  timestamp: Date;
  score?: number;
};

export type Notification = {
  message: string;
  type: string;
  removalDelay: number;
  delay: number;
  softDelete: boolean;
  _id: string;
};

export type PostMetadata = {
  title: string;
  author: string;
  tags: string[];
  timestamp: string;
};

export type GlobalState = {
  // modlists: Modlist[];
  // modlistfilter: string;
  // showInactiveMods: boolean;
  // modlist?: Modlist;
  notifications: Notification[];
  user?: User;
  adsenseScriptLoaded: boolean;
};

export type Actions = {
  login(token: string): void;
  loadAdsenseAds(): void;
  logout(): void;
  deleteModlist(username?: string): void;
  addNotification(
    message: string,
    options?: { type?: string; delay?: number; removalDelay?: number }
  ): void;
  removeNotification(_id: string): void;
};

export interface StoreProps extends GlobalState, Actions {}

export interface RouteProps<Matches = any> extends StoreProps {
  url: string;
  matches: Matches;
}
