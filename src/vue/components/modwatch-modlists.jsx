export default {
  props: {
    modlists: {
      type: Array,
      default: false
    }
  },
  data() {
    return {
      gameMap: {
        skyrim: "Skyrim Classic",
        skyrimse: "Skryim SE",
        fallout4: "Fallout 4"
      },
      debounceFilter: undefined
    };
  },
  methods: {
    search({ target = {} }) {
      clearTimeout(this.debounceFilter);
      this.debounceFilter = setTimeout(() => {
        if (target.value === "" || typeof target.value === "undefined") {
          this.$store.dispatch("getModlists");
          return;
        }
        this.$store.dispatch("searchModlists", { filter: target.value });
      }, 250);
    },
    clear() {
      this.$refs.filter.value = "";
      this.search({});
    }
  },
  render(h) {
    return (
      <div>
        <form>
          <input
            type="text"
            placeholder="Search"
            ref="filter"
            onInput={this.search}
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
          {this.modlists.map(m => (
            <tr>
              <td>
                <router-link to={`/u/${m.username}`}>{m.username}</router-link>
              </td>
              <td>{this.gameMap[m.game || "skyrim"]}</td>
              <td class="responsive-hide">
                {new Date(m.timestamp).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
};
