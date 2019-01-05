import { h, Component } from "preact";
import { Link } from "preact-router/match";

export default class ModwatchModlists extends Component {
  state = {
    gameMap: {
      skyrim: "Skyrim Classic",
      skyrimse: "Skryim SE",
      fallout4: "Fallout 4"
    },
    debounceFilter: undefined,
    filter: ""
  };
  search(value = "") {
    clearTimeout(this.debounceFilter);
    this.setState(() => ({
      filter: value,
      debounceFilter: setTimeout(() => {
        if (value === "") {
          this.props.getModlists();
          return;
        }
        this.props.searchModlists({ filter: value });
      }, 250)
    }));
  }
  clear() {
    this.setState(() => ({
      filter: ""
    }));
    this.search();
  }
  render(props, state) {
    return (
      <div>
        <form>
          <input
            type="text"
            placeholder="Search"
            value={state.filter}
            onInput={e => this.search(e.target.value)}
          />
          <button type="button" onClick={this.clear}>
            Clear
          </button>
        </form>
        <table class="modlists-table">
          <thead>
            <tr>
              <th>Username</th>
              <th>Game</th>
              <th class="responsive-hide">Timestamp</th>
            </tr>
          </thead>
          {state.modlists.map(m => (
            <tr>
              <td>
                <Link href={`/u/${m.username}`}>{m.username}</Link>
              </td>
              <td>{state.gameMap[m.game || "skyrim"]}</td>
              <td class="responsive-hide">
                {new Date(m.timestamp).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
