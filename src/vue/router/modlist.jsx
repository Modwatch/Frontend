import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "modlist"
    ]),
    list() {
      if(this.current === "plugins") {
        return this.modlist.plugins.map((line, index) => ({
          content: line,
          descriptor: line.slice(-3),
          index: index + 1
        }));
      } else if(this.current === "modlist") {
        return Array.prototype.slice.call(this.modlist.modlist.map((line, index, ref) => ({
          content: line.slice(1),
          descriptor: this.modlistMap[line[0]],
          index: ref.length - index
        })), 0).reverse();
      } else if(this.current.indexOf("ini") !== -1) {
        return this.modlist[this.current].map((line, index) => ({
          content: line,
          descriptor: line[0] !== ";" ? (line[0] !== "[" ? "setting" : "section") : "comment",
          index: index + 1
        }));
      } else {
        return this.modlist[this.current].map((line, index) => ({
          content: line,
          index: index + 1
        }));
      }
    },
    username() {
      return this.$route.params.username;
    },
    gameDisplay() {
      return this.gameMap[this.modlist.game];
    },
    files() {
      return this.modlist.files ? Object.keys(this.modlist.files) : [];
    }
  },
  data() {
    return {
      filter: "",
      current: "plugins",
      gameMap: {
        skyrim: "Skyrim Classic",
        skyrimse: "Skryim SE",
        fallout: "Fallout 4"
      },
      modlistMap: {
        "+": "enabled",
        "-": "disabled",
        "*": "unmanaged"
      }
    };
  },
  methods: {
    switchFileTypes({ target }) {
      this.$store.dispatch("getModlistFileType", {username: this.username, filetype: target.dataset.filetype})
      .then(() => {
        this.current = target.dataset.filetype;
      });
    }
  },
  render(h) {
    return (<div class="modlist-wrapper">
      <section class="modlist-meta">
        <p>{this.username}</p>
        <p>{this.files.map(t => (
          <button data-filetype={t} onClick={this.switchFileTypes}>{t}</button>
        ))}</p>
        <p>{this.gameDisplay}</p>
      </section>
      <section class="modlist-content">
        <ul>
          {this.list.map(line => (
            <li class={`modlist-item ${line.descriptor ? line.descriptor : ""}`}>
              <span class="modlist-item-index">{line.index}.</span>
              <span class="modlist-item-content">{ line.content }</span>
              {line.descriptor && (
                <span class="modlist-item-descriptor"></span>
              )}
            </li>
          ))}
        </ul>
      </section>
    </div>);
  },
  created() {
    console.log(this.$route);
    return this.$store.dispatch("getModlist", this.$route.params.username)
  }
}
