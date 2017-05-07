export default {
  props: {
    modlists: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gameMap: {
        skyrim: "Skyrim Classic",
        skyrimse: "Skryim SE",
        fallout: "Fallout"
      }
    };
  },
  render(h) {
    return (
      <div>
        <table class="modlists-table">
          <thead v-once>
            <tr>
              <th>Username</th>
              <th>Game</th>
              <th class="responsive-hide">Timestamp</th>
            </tr>
          </thead>
          {this.modlists.map(m => (
            <tr v-once>
              <td><router-link to={ {name: "Modlist", params: { username: m.username } } }>{m.username}</router-link></td>
              <td>{this.gameMap[m.game || "skyrim"]}</td>
              <td class="responsive-hide">{new Date(m.timestamp).toLocaleDateString()}</td>
            </tr>
          ))}
        </table>
      </div>
    );
  }
}
