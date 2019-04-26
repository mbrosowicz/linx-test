const express = require("express");
const app = express();
const path = require("path");

app.use("/styles", express.static(__dirname + "/webapp/src/styles"));
app.use("/js", express.static(__dirname + "/webapp/src/js"));

// viewed at based directory http://localhost:8080/
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/webapp/src/index.html"));
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Express server listening on port 8080`);
});
