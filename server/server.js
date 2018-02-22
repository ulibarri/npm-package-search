let fs = require("fs");
let api = require("api-npm");
let express = require("express");
let bodyParser = require("body-parser");
let pack = require("./models/pack");
let path = require("path");

let myPack = new pack();
let app = express();

app.set("view engine", "ejs");
app.use("/", express.static(path.join(__dirname, "../public")));
app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.render("../server/views/search");
});

app.post("/npmpack", (req, res) => {
  let version = req.body.version.trim();
  if (version.length > 0) {
    api.getdetails(req.body.pname, details => {
      res.render("../server/views/npmsingle", {
        details,
        data: details.versions[version]
      });
    });
  } else {
    api.getdetails(req.body.pname, details => {
      res.render("../server/views/npmtable", {
        details,
        data: Object.values(details.versions)
      });
    });
  }
});

app.post("/save", (req, res) => {
  let bod = req.body;
  // let datos = req.body;
  // console.log(datos[0][0].toString());
  //res.end(datos[0].name.toString());
  var bodKeys = Object.keys(bod);
  bodKeys.forEach(function(packs) {
    var items = Object.keys(bod[packs]);
    items.forEach(function(item) {
      var value = bod[packs][item];
      if (value.name != "null") {
        let newPack = new pack(value);
        newPack.save();
      }
    });
  });
  res.redirect("/packs");
});

app.get("/packs", (req, res) => {
  myPack.find("all", function(err, data) {
    if (err) {
      res.status(400).send({ err });
    } else {
      res.render("../server/views/mysqltable", { data });
    }
  });
});

app.post("/delete", (req, res) => {
  let bod = req.body;

  var bodKeys = Object.keys(bod);
  bodKeys.forEach(function(packs) {
    var items = Object.keys(bod[packs]);
    items.forEach(function(item) {
      var value = bod[packs][item];
      if (value.name != "null") {
        let newPack = new pack();
        newPack.set("id", value);
        newPack.remove();
      }
    });
  });
  res.redirect("/packs");
});

app.get("/packs/:id", (req, res) => {
  let packId = req.params.id;
  myPack.find("first", { where: "id = " + packId }, (err, row) => {
    if (err) {
      res.status(400).send({ err });
    } else {
      res.send({ row });
    }
  });
});

if (!module.parent) {
  app.listen(3000, () => {
    console.log("server listening on port 3000");
  });
}
