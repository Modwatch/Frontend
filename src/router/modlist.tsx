import { h, Component } from "preact";
import { Link, route } from "preact-router";

import "./modlist.css";

import { getModlist, getModlistFileType } from "../store/pure";

import { RouteProps } from "../types";
import { Modlist } from "@modwatch/types";
import ModwatchFile from "../components/modwatch-file";

const gameMap = {
  skyrim: "Skyrim Classic",
  skyrimse: "Skyrim SE",
  fallout4: "Fallout 4"
};
const filetypeMap = game => ({
  plugins: "plugins",
  modlist: "modlist",
  ini: game.indexOf("skyrim") !== -1 ? "skyrim" : game,
  prefsini: `${game.indexOf("skyrim") !== -1 ? "skyrim" : game}Prefs`
});
const initialState = {
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
    score: undefined
  },
  files: [],
  gameDisplay: undefined,
  isAdmin: false,
  filetype: "plugins"
};

type ComponentProps = RouteProps<{
  username: string;
  filetype: string;
  path?: string;
}>;
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

export default class ModlistWrapper extends Component<
  ComponentProps,
  ComponentState
> {
  constructor(props: ComponentProps) {
    super(props);
    this.state = {
      ...initialState,
      isAdmin: props.user && props.user.scopes.indexOf("admin") !== -1,
      // filetype: props.matches.filetype || undefined
    };
  }

  initialize = async ({ clear }: { clear?: boolean } = {}) => {
    clear &&
      this.setState({
        modlist: initialState.modlist,
        filetype: initialState.filetype
      });
    const [modlist, file] = await Promise.all([
      getModlist({
        username: this.props.matches.username
      }),
      this.state.filetype !== "plugins"
        ? getModlistFileType(this.props.matches)
        : undefined
    ]);
    const files = Object.keys(modlist.files).filter(
      key => modlist.files[key] > 0
    );
    this.setState(() => ({
      modlist: {
        ...modlist,
        [this.state.filetype]: file || modlist.plugins
      },
      gameDisplay: gameMap[modlist.game || "skyrim"],
      files
    }));
    if (!files.includes(this.props.matches.filetype)) {
      route(`/u/${this.props.matches.username}/${files[0]}`, true);
    }
  };
  componentDidMount() {
    console.log("it mounts?");
    this.initialize({ clear: true });
  }
  updateFilter = ({ target }) => {
    if (this.state.filtering) {
      clearTimeout(this.state.filterTimeoutID);
    }
    this.setState(() => ({
      filtering: true,
      filterTimeoutID: window.setTimeout(() => {
        this.setState(() => ({
          filter: target.value,
          filtering: false
        }));
      }, 200)
    }));
  };
  toggleActiveMods = () => {
    this.setState(({ showInactiveMods }) => ({
      showInactiveMods: !showInactiveMods
    }));
  };
  shouldComponentUpdate(nextProps, nextState) {
    // const kPop = Object.keys(this.props).filter(k => typeof this.props[k] !== "function");
    // console.log("PROPS", kPop.map(k => ({ [k]: this.props[k] })), kPop.map(k => ({ [k]: nextProps[k] })));

    // const kState = Object.keys(this.state).filter(k => typeof this.state[k] !== "function");
    // console.log("STATE", kState.map(k => ({ [k]: this.state[k] })), kState.map(k => ({ [k]: nextState[k] })));

    const valid = [
      [this.state.filetype, nextState.filetype],
      [this.props.url, nextProps.url]
    ];
    // console.log(valid);
    return valid.map(set => set[0] !== set[1]).some(_ => true);
  }
  componentDidUpdate = async (prevProps: ComponentProps) => {
    if (typeof this.props.matches.username === "undefined") {
      return;
    }
    if (this.props.matches.username !== prevProps.matches.username) {
      this.initialize({ clear: true });
    } else if (this.props.matches.filetype !== prevProps.matches.filetype) {
      this.setState({
        filetype: this.props.matches.filetype
      });
      const file = await getModlistFileType(this.props.matches);
      this.setState(({ modlist }) => ({
        modlist: {
          ...modlist,
          [this.props.matches.filetype]: file
        }
      }));
    }
  }
  render() {
    const { matches, user, deleteModlist } = this.props;
    const {
      modlist,
      files,
      gameDisplay,
      isAdmin,
      filetype,
      filter,
      showInactiveMods
    } = this.state;
    const showAdminTools =
      user && (isAdmin || user.username === matches.username);
    const complexLines = ["prefsini", "ini"].includes(filetype);
    const _fileTypeMap = modlist.game ? filetypeMap(modlist.game) : {};
    return (
      <div class="modlist-wrapper">
        <section class="modlist-meta">
          <p class="modlist-username">{matches.username}</p>
          {modlist.enb && <p class="modlist-enb">ENB: {modlist.enb}</p>}
          {modlist.tag && <p class="modlist-tag">Tag: {modlist.tag}</p>}
          <p class="modlist-gamedisplay">{gameDisplay}</p>
          {showAdminTools && (
            <div class="modlist-actions">
              <button type="button" onClick={e => deleteModlist()}>
                Delete
              </button>
            </div>
          )}
        </section>
        <section class="modlist-content">
          <nav class="modlist-filetype-nav">
            <ul>
              {files.map(t => (
                <li>
                  <Link
                    href={`/u/${encodeURIComponent(
                      matches.username
                    )}/${encodeURIComponent(t)}`}
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
                onInput={this.updateFilter}
              />
            </span>
            {filetype === "modlist" && (
              <span class="form-group">
                <label for="modlist-enabled-toggle">Inactive Mods</label>
                <input
                  type="checkbox"
                  id="modlist-enabled-toggle"
                  onChange={this.toggleActiveMods}
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
  }
}
