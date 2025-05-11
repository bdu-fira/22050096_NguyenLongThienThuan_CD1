const Sequelize = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('../config/database').development;

const db = {};

// Khởi tạo Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Tự động load các model trong thư mục hiện tại
fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js') && (file.slice(-3) === '.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Định nghĩa các association (nếu có)
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
// sequelize.sync({ alter: true }) // <-- Tự động tạo hoặc cập nhật table
//   .then(() => {
//     console.log('✅ Database synced (tables updated from models)');
//   })
//   .catch(err => {
//     console.error('❌ Sync failed:', err);
//   });
module.exports = db;