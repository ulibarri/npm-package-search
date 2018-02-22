let  mysqlModel = require('mysql-model');
var MyAppModel = mysqlModel.createConnection({
    host     : 'npm.ct2erbxse8ve.us-west-2.rds.amazonaws.com',
    user     : 'root',
    password : '2211R00t',
    database : 'npmpacks',
  });

  module.exports=MyAppModel;