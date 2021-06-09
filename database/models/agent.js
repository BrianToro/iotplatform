'use strict'

const Sequelize = require('sequelize')
const setUpDB = require('../lib/database')

module.exports = ({ config }) => {
  const sequelize = setUpDB({ config })
  return sequelize.define('agent', {
    uuid: { type: Sequelize.STRING, allowNull: false },
    username: { type: Sequelize.STRING, allowNull: false },
    name: { type: Sequelize.STRING, allowNull: false },
    hostname: { type: Sequelize.STRING, allowNull: false },
    pid: { type: Sequelize.INTEGER, allowNull: false },
    connected: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
  })
}
