import request from "request";

export default app => {

  app.get("/", (req, res) => {
    res.sendFile("index.html", {
      root: "server/"
    }, (err) => {
      if (err) {
				console.log(err);
				res.writeHead(500);
      }
    });
  });
  app.get("/sw.js", (req, res) => {
    res.sendFile("sw.js", {
      root: "public/"
    }, (err) => {
      if (err) {
				console.log(err);
				res.writeHead(500);
      }
    });
  });
  app.get("/u/:username", (req, res) => {
    res.redirect(`/#/u/${req.params.username}`);
  });
  app.get("/userlist", (req, res) => {
    res.redirect("/#userlist");
  });

  /**
   *  Legacy redirect, keep this after all the other routes
   */
  app.get("/:username", (req, res) => {
    res.redirect(`/#/u/${req.params.username}`);
  });

};
