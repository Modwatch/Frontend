import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "modlist"
    ]),
    lines() {
      return this.$store.getters.complexlines({filetype: "prefsini"});
    }
  },
  created() {
    this.$store.dispatch("getModlistFileType", { username: this.$route.params.username, filetype: "prefsini"});
  },
  render(h) {
    return (<modwatch-file lines={this.lines} complex-lines></modwatch-file>);
  }
}
