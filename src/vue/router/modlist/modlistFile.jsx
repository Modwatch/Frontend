import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "modlist",
      "modlistfilter",
      "showInactiveMods"
    ]),
    lines() {
      return Array.prototype.slice.call(this.modlist.modlist.filter(l => this.modlistfilter === "" || l.toLowerCase().indexOf(this.modlistfilter.toLowerCase()) !== -1).map((line, index, ref) => ({
        content: line,
        descriptor: this.modlistMap[line[0]],
        index: ref.length - index
      })), 0).reverse();
    }
  },
  data() {
    return {
      modlistMap: {
        "+": "enabled",
        "-": "disabled",
        "*": "unmanaged"
      }
    };
  },
  created() {
    this.$store.dispatch("getModlistFileType", { username: this.$route.params.username, filetype: "modlist"});
  },
  render(h) {
    return (<modwatch-file lines={this.showInactiveMods ? this.lines : this.lines.filter(line => line.descriptor !== "disabled")}></modwatch-file>);
  }
}
