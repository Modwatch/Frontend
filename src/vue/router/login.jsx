export default {
  created() {
    console.log("login");
  },
  render(h) {
    return (
      <section>
        <h1>Login</h1>
        <form class="login-wrapper">
          <input placeholder="Username"/>
          <input type="password" placeholder="Password"/>
          <button>Login</button>
        </form>
      </section>
    );
  }
}
