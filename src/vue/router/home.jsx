import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "modlists"
    ])
  },
  created() {
    this.$store.dispatch("getModlists");
  },
  methods: {
    goto(ev) {
      this.$router.push({name: ev.target.dataset.routeName, path: ev.target.dataset.routePath});
    }
  },
  render(h) {
    return (
      <div>
        <section>
          <h1>What is Modwatch</h1>
          <p>
            Modwatch is a site for uploading and sharing modlists for Skyrim (and eventually other games).
            If you want to view some of the 5000+ modlists, you can look through the dropdown to the right.
            Or if you have one in mind, you can view it at modwat.ch/u/username.
          </p>
        </section>
        <section>
          <h1>Uploading Your Mods</h1>
          <p>
            If you want to upload your own modlist, you can download the uploader via the gigantic orange button at the top of the page.
            Instructions for uploading are detailed on the nexus page.
          </p>
        </section>
        <section>
          <h1>Search Modlists</h1>
          <modwatch-modlists modlists={this.modlists}></modwatch-modlists>
        </section>
      </div>
    );
  }
}
