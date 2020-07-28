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
  adsense: {
    loaded: boolean;
    failed: boolean;
  };
};

export type Actions = {
  login(token: string): Promise<void>;
  loadAdsenseAds(): Promise<void>;
  logout(): Promise<void>;
  deleteModlist(username?: string): Promise<void>;
  addNotification(
    message: string,
    options?: { type?: string; delay?: number; removalDelay?: number }
  ): Promise<void>;
  removeNotification(_id: string): Promise<void>;
};

export interface StoreProps extends GlobalState, Actions {}
