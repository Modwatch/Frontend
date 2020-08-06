import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { Link, useRoute } from "wouter-preact";

import "./modlist.css";

import { getModlist, getModlistFileType } from "../store/pure";

import { StoreProps } from "../types";
import { Modlist } from "@modwatch/types";
import ModwatchFile from "@modwatch/core/src/components/modwatch-file";
type ComponentState = {
  showInactiveMods: boolean;
  gameDisplay?: string;
  filter: string;
  filtering: boolean;
  filterTimeoutID?: number;
  modlist: Partial<Modlist>;
  files: string[];
  isAdmin: boolean;
  filetype: string;
};

const gameMap = {
  skyrim: "Skyrim Classic",
  skyrimse: "Skyrim SE",
  fallout4: "Fallout 4",
};
const filetypeMap = (game) => ({
  plugins: "plugins",
  modlist: "modlist",
  ini: game.indexOf("skyrim") !== -1 ? "skyrim" : game,
  prefsini: `${game.indexOf("skyrim") !== -1 ? "skyrim" : game}Prefs`,
});
const initialState: ComponentState = {
  filter: "",
  filtering: false,
  filterTimeoutID: undefined,
  showInactiveMods: false,
  modlist: {
    files: {},
    plugins: [],
    tag: undefined,
    enb: undefined,
    game: undefined,
    timestamp: undefined,
    score: undefined,
  },
  files: [],
  gameDisplay: undefined,
  isAdmin: false,
  filetype: "plugins",
};

export const useSearchFilter = (
  debounceRate = 200
): [string, (value: string) => void] => {
  const [filter, innerSetFilter] = useState("");
  const [filterTimeoutID, setFilterTimeoutID] = useState(null);

  function setFilter(value: string) {
    window.clearTimeout(filterTimeoutID);
    setFilterTimeoutID(
      window.setTimeout(() => {
        innerSetFilter(value);
      }, debounceRate)
    );
  }

  return [filter, setFilter];
};

export default (props: StoreProps) => {
  const [filter, setFilter] = useSearchFilter();
  const [showInactiveMods, setShowInactiveMods] = useState(false);
  const [modlist, setModlist] = useState(initialState.modlist);
  const [files, setFiles] = useState([]);
  const [, params] = useRoute("/u/:username/:filetype?");
  const [username, filetype] = [
    params.username,
    params.filetype || "plugins",
  ].map((s) => decodeURIComponent(s));

  useEffect(() => {
    const fetcher = async () => {
      const [_modlist, _file] = await Promise.all([
        getModlist({
          username,
        }),
        filetype !== "plugins"
          ? getModlistFileType({
              username,
              filetype,
            })
          : undefined,
      ]);
      const _files = Object.keys(_modlist.files).filter(
        (key) => _modlist.files[key] > 0
      );
      setModlist({
        ..._modlist,
        ...(_file
          ? {
              [filetype]: _file,
            }
          : {}),
      });
      setFiles(_files);

      await props.loadAdsenseAds();
      if (!props.adsense.failed) {
        //@ts-ignore google adsense nonsense
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    };
    fetcher();
  }, [params.username, params.filetype]);

  const { user, deleteModlist, adsense } = props;
  const showAdminTools =
    user &&
    user.scopes &&
    (user.scopes.indexOf("admin") !== -1 || user.username === username);
  const complexLines = ["prefsini", "ini"].includes(filetype);
  const _fileTypeMap = modlist.game ? filetypeMap(modlist.game) : {};

  return (
    <div class="modlist-wrapper">
      <section class="modlist-meta">
        <p class="modlist-username">{username}</p>
        {modlist.enb && <p class="modlist-enb">ENB: {modlist.enb}</p>}
        {modlist.tag && <p class="modlist-tag">Tag: {modlist.tag}</p>}
        <p class="modlist-gamedisplay">{gameMap[modlist.game] || ""}</p>
        {showAdminTools && (
          <div class="modlist-actions">
            <button type="button" onClick={(e) => deleteModlist()}>
              Delete
            </button>
          </div>
        )}
      </section>
      {process.env.ADSENSE_ENABLED && (
        <ins
          class="adsbygoogle"
          style={{
            display: "block",
            width: "100%",
            height: !adsense.failed ? "280px" : "0",
            marginBottom: !adsense.failed ? "25px" : "0",
          }}
          data-ad-client={process.env.ADSENSE_CLIENT}
          data-adtest={process.env.NODE_ENV !== "production" ? "on" : undefined}
          data-ad-slot="1008233292"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
      )}
      <section class="modlist-content">
        <nav class="modlist-filetype-nav">
          <ul>
            {files.map((t) => (
              <li>
                <Link
                  href={`/u/${params.username}/${encodeURIComponent(t)}`}
                  class="no-underline"
                >
                  <button class={filetype === t ? "active" : ""}>
                    {_fileTypeMap[t]}
                  </button>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <form class="modlist-filter">
          <span class="form-group">
            <label
              for="modlist-filter"
              style="visibility: hidden; display: none;"
            >
              Filter
            </label>
            <input
              type="text"
              id="modlist-filter"
              placeholder="Filter By..."
              //@ts-ignore stupid typescript onInput type checking
              onInput={({ target }) => setFilter(target.value)}
            />
          </span>
          {filetype === "modlist" && (
            <span class="form-group">
              <label for="modlist-enabled-toggle">Inactive Mods</label>
              <input
                type="checkbox"
                id="modlist-enabled-toggle"
                onChange={(e) => setShowInactiveMods(!showInactiveMods)}
              />
            </span>
          )}
        </form>
        {modlist[filetype] && modlist[filetype].length > 0 && (
          <ModwatchFile
            filter={filter}
            showInactiveMods={showInactiveMods}
            filetype={filetype}
            showDescriptor={filetype === "plugins"}
            complexLines={complexLines}
            lines={modlist[filetype] as string[]}
          />
        )}
      </section>
    </div>
  );
};
