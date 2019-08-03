import { h, Component } from "preact";
import { Link } from "preact-router";

import { searchModlists, getModlists } from "../store/pure";

import { PartialModlist } from "../types";

const styles = {
  th: {
    borderBottom: "1px solid",
    padding: "3px"
  },
  td: {
    padding: "3px"
  },
  modlistTable: { width: "100%", textAlign: "left" }
};

export default class ModwatchModlists extends Component<{}, {
  modlists: PartialModlist[];
  gameMap: {
    [key: string]: string;
  };
  debounceFilter?: number;
  filter: string;
}> {
  state = {
    modlists: [],
    gameMap: {
      skyrim: "Skyrim Classic",
      skyrimse: "Skryim SE",
      fallout4: "Fallout 4"
    },
    debounceFilter: undefined,
    filter: ""
  };
  async componentDidMount() {
    const modlists = await getModlists();
    this.setState(() => ({
      modlists: prettifyModlists(modlists)
    }));
  }
  search = (value = "", debounce = 250) => {
    clearTimeout(this.state.debounceFilter);
    this.setState(() => ({
      filter: value,
      debounceFilter: window.setTimeout(async () => {
        if (value === "") {
          const modlists = await getModlists();
          this.setState(() => ({
            modlists: prettifyModlists(modlists)
          }));
          return;
        }
        const modlists = (await searchModlists({ filter: value }));
        this.setState(() => ({
          modlists: prettifyModlists(modlists)
        }));
      }, debounce)
    }));
  }
  clear = () => {
    this.setState(() => ({
      filter: ""
    }));
    this.search(undefined, 0);
  }
  render() {
    return (
      <div>
        <form>
          <label for="modlists-search" style="display: none">
            Search
          </label>
          <input
            type="text"
            placeholder="Search"
            id="modlists-search"
            value={this.state.filter}
            onInput={e => this.search((e.target as HTMLInputElement).value)}
          />
          <button type="button" onClick={this.clear}>
            Clear
          </button>
        </form>
        <table style={styles.modlistTable}>
          <thead>
            <tr>
              <th style={styles.th}>Username</th>
              <th style={styles.th}>Game</th>
              <th style={styles.th} class="responsive-hide">Timestamp</th>
            </tr>
          </thead>
          {this.state.modlists.map(({ username, encodedUsername, game, displayTimestamp, timestampTitle }) => (
            <tr>
              <td style={styles.td}>
                <Link href={`/u/${encodedUsername}`}>{username}</Link>
              </td>
              <td style={styles.td}>{this.state.gameMap[game]}</td>
              <td style={styles.td} title={timestampTitle} class="responsive-hide">
                {displayTimestamp}
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}

function prettifyModlists(modlists: PartialModlist[]): PartialModlist[] {
  let t;
  return modlists.map(m => (t = new Date(m.timestamp), {
    ...m,
    game: m.game || "skyrim",
    encodedUsername: encodeURIComponent(m.username),
    displayTimestamp: t.toLocaleTimeString(),
    timestampTitle: t.toLocaleString()
  }))
}