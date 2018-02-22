const MyAppModel = require("../db/mysql");

let pack = MyAppModel.extend({
  tableName: "packs"
});
module.exports = pack;
