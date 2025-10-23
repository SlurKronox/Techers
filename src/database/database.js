const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'bancoteste.sqlite'),
  logging: false // remove logs no console
});

module.exports = sequelize;
