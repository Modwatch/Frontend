export default {
  props: {
    user: {
      type: String,
      default: ""
    },
    linkClass: {
      type: String,
      default: ""
    },
    text: {
      type: String,
      default: "Login"
    }
  },
  data() {
    return {
      loginLink: `${process.env.MODWATCH_API_URL}/oauth/authorize`,
      redirect_uri: encodeURIComponent(
        `${window.location.protocol}//${window.location.host}/`
      )
    };
  },
  methods: {
    login() {
      window.location.replace(
        `${this.loginLink}?client_id=modwatch&redirect_uri=${
          this.redirect_uri
        }&response_type=code${
          process.env.MODWATCH_ENV === "local" ? "&scopes=upload" : ""
        }`
      );
    }
  },
  render(h) {
    return (
      <a onClick={this.login} class={this.linkClass}>
        {this.text}
      </a>
    );
  }
};
