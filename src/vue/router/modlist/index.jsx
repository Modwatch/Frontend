import { mapState } from "vuex";

export default {
  computed: {
    ...mapState({
      modlist: state => state.modlist,
      isAdmin: state => state.user.scopes.indexOf("admin") !== -1,
      user: state => state.user.username
    }),
    showAdminTools() {
      return this.isAdmin || this.username === this.user;
    },
    username() {
      return this.$route.params.username;
    },
    gameDisplay() {
      return this.gameMap[this.modlist.game];
    },
    files() {
      return this.modlist.files ? Object.keys(this.modlist.files).filter(f => this.modlist.files[f] > 0) : [];
    },
    filetypeMap() {
      return {
        plugins: "plugins",
        modlist: "modlist",
        ini: this.modlist.game.indexOf("skyrim") !== -1 ? "skyrim" : this.modlist.game,
        prefsini: `${this.modlist.game.indexOf("skyrim") !== -1 ? "skyrim" : this.modlist.game}Prefs`
      };
    },
    current() {
      return this.$route.name || "plugins";
    }
  },
  data() {
    return {
      gameMap: {
        skyrim: "Skyrim Classic",
        skyrimse: "Skyrim SE",
        fallout: "Fallout 4"
      },
      filtering: false,
      filterTimeoutID: undefined
    };
  },
  methods: {
    updateFilter({ target }) {
      if(this.filtering) {
        clearTimeout(this.filterTimeoutID);
      }
      this.filtering = true;
      this.filterTimeoutID = setTimeout(() => {
        this.$store.commit("modlistfilter", target.value);
        this.filtering = false;
      }, 333);
    },
    deleteModlist() {
      if(window.confirm("Are you sure you want to delete this modlist?")) {
        this.$store.dispatch("deleteModlist", { username: this.username })
        .then(deleted => {
          if(deleted) {
            this.$store.dispatch("notification", { notification: `Deleted ${this.username}` });
            this.$router.push("/");
          } else {
            this.$store.dispatch("notification", { notification: `Couldn't Delete ${this.username}` });
          }
        })
        .catch(() => {
          this.$store.dispatch("notification", { notification: `Couldn't Delete ${this.username}` });
        });
      }
    }
  },
  render(h) {
    return (<div class="modlist-wrapper">
      <section class="modlist-meta">
        <p>{this.username} {this.showAdminTools && <button type="button" onClick={this.deleteModlist}>Delete</button>}</p>
        <p>{this.modlistShowAll}</p>
        <p>{this.gameDisplay}</p>
      </section>
      <section class="modlist-content">
        <nav class="modlist-filetype-nav">
          <ul>
            {this.files.map(t => (
              <li><router-link to={`/u/${this.username}/${t}`}><button class={this.current === t && "active"}>{this.filetypeMap[t]}</button></router-link></li>
            ))}
          </ul>
        </nav>
        <form class="modlist-filter">
          <span class="form-group">
            <label for="modlist-filter" style="visibility: hidden; display: none;">Filter</label>
            <input type="text" id="modlist-filter" placeholder="Filter By..." onInput={this.updateFilter} />
          </span>
        </form>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </section>
    </div>);
  },
  created() {
    this.$store.commit("modlistfilter");
  }
}
