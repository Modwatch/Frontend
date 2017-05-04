export default {
  created() {
    console.log("login");
  },
  render(h) {
    return (
      <section>
        <h1>Login</h1>
        <div>
          <input placeholder="Username"/>
          <input placeholder="Password"/>
        </div>
      </section>
    );
  }
}
