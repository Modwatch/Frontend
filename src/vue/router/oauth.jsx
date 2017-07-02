export default {
  created() {
    console.log("oauth");
    const { access_token, token_type, expires_in } = this.$route.params;
    if(access_token) {
      this.$store.dispatch("verify", { access_token })
      .then(valid => {
        if(!valid) {
          this.$store.dispatch("notification", { notification: "Invalid Token" });
          return this.dispatch("logout");
        }
        this.$store.dispatch("notification", { notification: "Successfully Logged In" });
        this.$store.commit("login", access_token);
      })
      .catch(() => 0)
      .then(() => {
        this.$router.push("/");
      });
    }
  },
  render(h) {
    return (<div></div>);
  }
}
