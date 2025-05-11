const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config/config.js');

const db = {};

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
  logging: config.development.logging,
  port:config.development.port
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Load models
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

//Sync the database
// sequelize.sync({force: false}) // set true to re-create database if needed
//   .then(() => {
//     console.log('✓ DB connection success.');
//   })
//   .catch(err => {
//     console.error(err);
//     console.log('✗ DB connection error. Please check your configuration.');
//   });

module.exports = db;