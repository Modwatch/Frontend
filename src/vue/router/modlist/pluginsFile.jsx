import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "modlist",
      "modlistfilter"
    ]),
    lines() {
      return this.modlist.plugins.filter(l => this.modlistfilter === "" || l.toLowerCase().indexOf(this.modlistfilter.toLowerCase()) !== -1).map((line, index) => ({
        content: line,
        descriptor: line.slice(-3),
        index: index + 1
      }));
    }
  },
  render(h) {
    return (<modwatch-file lines={this.lines} show-descriptor></modwatch-file>);
  }
}
