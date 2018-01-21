import { mapState } from "vuex";
import Login from "../components/modwatch-login.jsx";

export default {
  computed: {
    ...mapState({
      user: state => state.user,
      gameMap: state => state.gameMap
    })
  },
  created() {
    // this.$store.dispatch("get");
  },
  methods: {
    goto(ev) {
      this.$router.push({
        name: ev.target.dataset.routeName,
        path: ev.target.dataset.routePath
      });
    },
    selectPlugins(ev) {
      console.log(ev);
    },
    selectIni(ev) {
      console.log(ev);
    }
  },
  render(h) {
    const mapKeys = Object.keys(this.gameMap);
    return (
      <section>
        <h2>Uploader</h2>
        {!this.user.authenticated && (
          <span>
            <p>
              If you already have an account, you can{" "}
              <Login user={this.user.username} text={"log in"} /> here.
            </p>
            <p>
              Otherwise, upload your modlist below and your account will be
              created.
            </p>
          </span>
        )}
        <form>
          <div>
            <span>
              <label for="uploader-username" class="sr-only">
                Username
              </label>
              <input
                id="uploader-username"
                placeholder="Username"
                type="text"
                readOnly={!!this.user.authenticated}
                value={this.user.username}
              />
            </span>
            {!this.user.authenticated ? (
              <span>
                <label for="uploader-password" class="sr-only">
                  Password
                </label>
                <input title="Password" id="uploader-password" placeholder="Password" type="password" />
              </span>
            ) : (
              <span>
                <label for="uploader-token" class="sr-only">
                  API Token
                </label>
                <input title="API Token" id="uploader-token" placeholder="API Token" type="password" readOnly value={this.user.token} />
              </span>
            )}
          </div>
          <div>
            <span>
              <label for="uploader-tag" class="sr-only">
                Tag
              </label>
              <input id="uploader-tag" placeholder="Tag" type="text" />
            </span>
            <span>
              <label for="uploader-enb" class="sr-only">
                ENB
              </label>
              <input id="uploader-enb" placeholder="ENB" type="text" />
            </span>
          </div>
          <div>
            <label for="uploader-game" class="sr-only">
              Game
            </label>
            <select id="uploader-game">
              {mapKeys.map(key => (
                <option value={key}>{this.gameMap[key]}</option>
              ))}
            </select>
          </div>
          <div>
            <span>
              <label for="uploader-plugins" class="sr-only">
                Game
              </label>
              <input id="uploader-plugins" placeholder="plugins.ini" type="file" onChange={this.selectPlugins} />
            </span>
            <span>
              <label for="uploader-prefs" class="sr-only">
                Game
              </label>
              <input id="uploader-prefs" placeholder="ini.prefs" type="file" onChange={this.selectPlugins} />
            </span>
          </div>
        </form>
      </section>
    );
  }
};
